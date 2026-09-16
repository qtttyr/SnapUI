import * as p from '@clack/prompts';
import pc from 'picocolors';
import {
  attachToRunningChrome,
  launchIsolatedChrome,
  closeSession,
  showPicker,
  awaitPick,
  extractFromPick,
  assignClassNames,
  PANEL_SOURCE,
  type BrowserSession,
} from '../core/index.js';
import type { CaptureResult } from '../core/index.js';
import { generate } from '../generators/index.js';
import type { Framework, StyleFlavor } from '../generators/index.js';
import { loadConfig } from '../config.js';
import { writeFiles } from './writer.js';

function suggestName(hint: { tag: string; classes: string[]; id?: string; textSample?: string }): string {
  const JUNK_HASH = /^(astro-[a-z0-9]+|jsx-\d+|css-[a-z0-9]+|s-[a-z0-9]+|data-v-[a-z0-9]+|ng-[a-z0-9]+|sc-[a-zA-Z0-9]+)$/i;
  const validClasses = (hint.classes || []).filter((c) => !JUNK_HASH.test(c));
  if (validClasses.length) {
    const p = validClasses[0].split(/[-_]/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
    if (p && p.toLowerCase() !== 'div') return p;
  }
  if (hint.id && !JUNK_HASH.test(hint.id)) {
    const p = hint.id.split(/[-_]/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
    if (p) return p;
  }
  if (hint.textSample) {
    const words = hint.textSample.replace(/[^a-zA-Z0-9\s]/g, ' ').trim().split(/\s+/).filter((b) => b.length >= 3);
    if (words.length >= 1) {
      const titleName = words.slice(0, 2).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
      return `${titleName}Card`;
    }
  }
  const tag = hint.tag ? hint.tag.toLowerCase() : '';
  if (tag === 'div') return 'Card';
  return tag ? tag[0].toUpperCase() + tag.slice(1) : 'CapturedComponent';
}

function countNodes(node: { children: unknown[] }): number {
  let n = 1;
  for (const c of node.children as { children: unknown[] }[]) n += countNodes(c);
  return n;
}

/** Connect to (or launch) Chrome. Returns null if the user aborts. */
async function connectBrowser(): Promise<BrowserSession | null> {
  const attachPort = Number(process.env.SNAPUI_PORT) || 9222;
  const forceAttach = process.env.SNAPUI_ATTACH === '1';
  if (!forceAttach) {
    const s = p.spinner();
    s.start('Connecting to browser…');
    try {
      const session = await launchIsolatedChrome();
      s.stop('Launched Chrome (isolated profile — your logins stay private)');
      return session;
    } catch {
      s.stop('Could not launch Chrome directly.');
    }
  }

  p.log.message(pc.dim('Tip: start Chrome with remote debugging, then attach:'));
  p.log.message(pc.cyan(`  google-chrome --remote-debugging-port=${attachPort}`));

  const mode = await p.select({
    message: 'How should SnapUI connect?',
    options: [
      { value: 'attach', label: 'Attach to running Chrome (port 9222)' },
      { value: 'quit', label: 'Cancel' },
    ],
  });
  if (p.isCancel(mode) || mode === 'quit') return null;

  const s2 = p.spinner();
  s2.start(`Attaching to Chrome on :${attachPort}…`);
  try {
    const session = await attachToRunningChrome(attachPort);
    s2.stop('Attached to running Chrome');
    return session;
  } catch {
    s2.stop('Failed to attach.');
    p.log.error(`Start Chrome with: google-chrome --remote-debugging-port=${attachPort}`);
    return null;
  }
}

type PanelAction =
  | { type: 'generate'; name: string; framework: string; style: string; storybook: boolean }
  | { type: 'again' };

interface Waiters {
  generate: ((a: Extract<PanelAction, { type: 'generate' }>) => void) | null;
  again: (() => void) | null;
}

/**
 * Full interactive capture session — panel-driven.
 * Terminal asks only for the URL; everything else (pick → configure →
 * generate → review code) happens inside the in-browser side panel.
 * The session ends on Ctrl+C or when the browser window is closed.
 */
export async function runCaptureFlow(urlArg?: string): Promise<void> {
  const config = loadConfig();
  p.intro(pc.magenta('⬒ SnapUI') + pc.dim(' — capture any element as a real component'));

  // Ask for the URL BEFORE launching Chrome — no idle browser window waiting.
  let url = urlArg;
  if (!url) {
    const target = await p.text({
      message: 'URL to open',
      placeholder: 'https://stripe.com',
      validate: (v) => (v && !/^https?:\/\//.test(v) ? 'URL must start with http(s)://' : undefined),
    });
    if (p.isCancel(target)) {
      p.outro('Bye! 👋');
      return;
    }
    url = target as string;
  }

  const session = await connectBrowser();
  if (!session) {
    p.outro('Bye! 👋');
    return;
  }

  const waiters: Waiters = { generate: null, again: null };
  let browserClosed = false;
  let onClosed: (() => void) | null = null;
  session.browser.once?.('disconnected', () => {
    browserClosed = true;
    onClosed?.();
  });

  try {
    const s = p.spinner();
    s.start(`Opening ${pc.cyan(url)}…`);
    await session.page.goto(url, { waitUntil: 'networkidle2', timeout: 45_000 });
    s.stop('Page loaded');

    await session.page.exposeFunction('__snapuiPanelAction', (raw: string) => {
      const action = JSON.parse(raw) as PanelAction;
      if (action.type === 'generate') waiters.generate?.(action);
      if (action.type === 'again') waiters.again?.();
    });
    await session.page.evaluate(PANEL_SOURCE);

    p.log.step(
      pc.magenta('⬒') + ' ' + pc.bold('Click an element') + pc.dim(' in the browser — configure & generate right in the panel'),
    );

    const closedPromise = new Promise<'closed'>((res) => { onClosed = () => res('closed'); });

    for (;;) {
      await showPicker(session.page);
      await session.page.evaluate(() => {
        window.__snapuiPanelState?.({ phase: 'picking', hint: null, error: null });
      });

      const picked = await Promise.race([awaitPick(session.page), closedPromise]);
      if (picked === 'closed') break;
      if (!picked) {
        // Esc — stay in the session, arm the picker again.
        await session.page.evaluate(() => window.__snapuiPanelState?.({ phase: 'cancelled' }));
        continue;
      }

      let result: CaptureResult | null;
      try {
        result = await extractFromPick(session.page, picked);
      } catch (err) {
        await session.page.evaluate((error) => window.__snapuiPanelState?.({
          phase: 'error',
          error: 'Capture failed: ' + error,
        }), err instanceof Error ? err.message : String(err));
        continue;
      }
      if (!result) {
        await session.page.evaluate(() => window.__snapuiPanelState?.({ phase: 'cancelled' }));
        continue;
      }

      const suggestion = suggestName(result.hint);
      await session.page.evaluate((state) => window.__snapuiPanelState?.(state), {
        phase: 'configuring',
        hint: { ...result.hint, nodes: countNodes(result.root) },
        suggestion,
        framework: config.framework ?? 'react',
        style: config.style ?? 'css',
        error: null,
      });

      // Wait for the panel's Generate button.
      const action = await new Promise<Extract<PanelAction, { type: 'generate' }>>((res) => {
        waiters.generate = res;
      });
      waiters.generate = null;
      if (browserClosed) break;

      await session.page.evaluate(() => window.__snapuiPanelState?.({ phase: 'generating' }));

      const componentName = action.name.trim() || suggestion;
      const framework = action.framework as Framework;
      const style = action.style as StyleFlavor;
      assignClassNames(result.root, componentName);
      let files = generate({ componentName, framework, style, root: result.root });
      if (!action.storybook) files = files.filter((f) => !f.path.includes('storybook/'));

      const written = writeFiles(files, process.cwd());
      p.log.message(
        written.map((w) => pc.magenta('  ⬒ ') + pc.dim(w.replace(process.cwd() + '/', ''))).join('\n'),
      );

      await session.page.evaluate((state) => window.__snapuiPanelState?.(state), {
        phase: 'generated',
        files: files.map((f) => ({ path: f.path, content: f.content })),
        outDir: process.cwd(),
      });

      // Wait for "capture another" — Ctrl+C or closing the browser ends the session.
      await new Promise<void>((res) => { waiters.again = res; });
      waiters.again = null;
      if (browserClosed) break;
    }

    p.outro(pc.magenta('⬒') + ' Done — happy shipping!');
  } finally {
    await closeSession(session);
  }
}


