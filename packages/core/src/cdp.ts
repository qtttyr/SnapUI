import puppeteer, { type Browser, type Page } from 'puppeteer-core';
import { createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { get as httpsGet } from 'node:https';
import { Browser as BrowserKind, resolveBuildId, detectBrowserPlatform } from '@puppeteer/browsers';

const BROWSER_CACHE = join(homedir(), '.snapui', 'browser');
const CFT_BASE = 'https://storage.googleapis.com/chrome-for-testing-public';

/** Chrome-for-Testing download folder name per detected platform tag. */
export function chromeFolderName(platformTag: string): string {
  const map: Record<string, string> = {
    mac_arm: 'mac-arm64',
    mac: 'mac-x64',
    linux: 'linux64',
    win32: 'win32',
    win64: 'win64',
  };
  const folder = map[platformTag];
  if (!folder) throw new Error(`SnapUI requires Google Chrome: unsupported platform "${platformTag}".`);
  return folder;
}

/** Direct download URL for the Chrome-for-Testing archive. */
export function chromeDownloadUrl(platformTag: string, buildId: string): string {
  const folder = chromeFolderName(platformTag);
  return `${CFT_BASE}/${buildId}/${folder}/chrome-${folder}.zip`;
}

/** Executable path relative to the extracted archive root. */
function chromeExecutableRel(platformTag: string): string {
  const folder = chromeFolderName(platformTag);
  if (platformTag.startsWith('mac')) {
    return `${folder}/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
  }
  return `${folder}/chrome${platform() === 'win32' ? '.exe' : ''}`;
}

/** Where we keep a given managed Chrome build: ~/.snapui/browser/chrome/<tag>-<buildId>. */
function managedChromeDir(platformTag: string, buildId: string): string {
  return join(BROWSER_CACHE, 'chrome', `${platformTag}-${buildId}`);
}

/** A managed install is valid only if the app bundle is complete. */
export function isValidManagedInstall(exe: string): boolean {
  try {
    if (!existsSync(exe)) return false;
    if (platform() === 'darwin') {
      // The CfT binary in Contents/MacOS is a tiny stub — the real binary lives
      // in a Contents/Frameworks/<X>.framework bundle. The buggy
      // @puppeteer/browsers unpacker has been observed to drop exactly that
      // directory, so its presence + a full-size main binary is our health check.
      const appDir = join(exe, '..', '..');
      const frameworksDir = join(appDir, 'Frameworks');
      if (!existsSync(frameworksDir)) return false;
      for (const fw of readdirSync(frameworksDir)) {
        if (!fw.endsWith('.framework')) continue;
        const bin = join(frameworksDir, fw, 'Versions', 'Current', fw.replace(/\.framework$/, ''));
        if (existsSync(bin) && statSync(bin).size > 30 * 1024 * 1024) return true;
      }
      return false;
    }
    return statSync(exe).size > 30 * 1024 * 1024;
  } catch {
    return false;
  }
}

/** Download a file over HTTPS, following redirects. */
function downloadFile(url: string, dest: string, redirects = 5): Promise<void> {
  return new Promise((resolve, reject) => {
    httpsGet(url, (res) => {
      const status = res.statusCode ?? 0;
      const loc = res.headers.location;
      if (status >= 300 && status < 400 && loc && redirects > 0) {
        res.resume();
        downloadFile(new URL(loc, url).toString(), dest, redirects - 1).then(resolve, reject);
        return;
      }
      if (status !== 200) {
        res.resume();
        reject(new Error(`HTTP ${status} while downloading ${url}`));
        return;
      }
      const file = createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
      file.on('error', reject);
    }).on('error', reject);
  });
}

/** Extract the Chrome zip with a platform-appropriate, battle-tested unpacker. */
function unpackChromeZip(zipPath: string, destDir: string): void {
  const p = platform();
  if (p === 'darwin') {
    // ditto handles macOS zip resource forks correctly (unzip can corrupt .app bundles)
    execFileSync('ditto', ['-x', '-k', zipPath, destDir], { stdio: 'ignore' });
  } else if (p === 'win32') {
    execFileSync('powershell', ['-NoProfile', '-Command', `Expand-Archive -Force -Path '${zipPath}' -DestinationPath '${destDir}'`], { stdio: 'ignore' });
  } else {
    try {
      execFileSync('unzip', ['-o', '-q', zipPath, '-d', destDir], { stdio: 'ignore' });
    } catch {
      execFileSync('bsdtar', ['-xf', zipPath, '-C', destDir], { stdio: 'ignore' });
    }
  }
}

/**
 * Locate the user's installed Google Chrome. SnapUI is Chrome-only by design:
 * the DevTools Protocol dialect we rely on is a Chromium/Chrome feature, and we
 * officially support only Chrome (a managed Chrome-for-Testing copy counts too).
 */
export function findChromeExecutable(): string | null {
  const paths: string[] = [];
  const p = platform();
  if (p === 'darwin') {
    paths.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
  } else if (p === 'win32') {
    const localAppData = process.env.LOCALAPPDATA ?? join(homedir(), 'AppData', 'Local');
    paths.push(
      join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    );
  } else {
    paths.push(
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/opt/google/chrome/chrome',
    );
  }
  for (const candidate of paths) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

export interface BrowserSession {
  browser: Browser;
  page: Page;
  /** Whether we own the browser process (should close it on exit). */
  owned: boolean;
}

/**
 * Attach to an already-running Chrome started with --remote-debugging-port.
 * This is the zero-download path: users test on their own logged-in browser.
 */
export async function attachToRunningChrome(port = 9222): Promise<BrowserSession> {
  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${port}`,
    defaultViewport: null,
  });
  const pages = await browser.pages();
  const page = pages[pages.length - 1] ?? (await browser.newPage());
  return { browser, page, owned: false };
}

/**
 * Launch the user's installed Chrome with a fresh, isolated profile.
 * If no Chrome is found, downloads a managed Chromium into ~/.snapui/browser
 * (one-time, ~150MB) so the CLI works out of the box.
 */
export async function launchIsolatedChrome(url?: string, opts?: { headless?: boolean }): Promise<BrowserSession> {
  let executablePath =
    process.env.SNAPUI_FORCE_MANAGED === '1' ? null : findChromeExecutable();
  if (!executablePath) {
    executablePath = await ensureManagedBrowser();
  }
  const headless = opts?.headless ?? process.env.SNAPUI_HEADLESS === '1';
  const browser = await puppeteer.launch({
    executablePath,
    headless,
    defaultViewport: headless ? { width: 1440, height: 900 } : null,
    args: ['--no-first-run', '--no-default-browser-check', ...(headless ? [] : ['--start-maximized'])],
  });
  const pages = await browser.pages();
  const page = pages[0] ?? (await browser.newPage());
  if (url) await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  return { browser, page, owned: true };
}

/**
 * Ensure a working Chrome exists: reuse the managed Chrome-for-Testing copy if it
 * is healthy, otherwise (re)install it into ~/.snapui/browser. Validates the app
 * bundle after unpacking and retries once — a broken partial install is wiped and
 * downloaded again. If all of that fails we say so clearly: Chrome is required.
 */
export async function ensureManagedBrowser(): Promise<string> {
  const platformTag = detectBrowserPlatform();
  if (!platformTag) {
    throw new Error(
      'SnapUI requires Google Chrome. This platform cannot run the managed Chrome download — please install Google Chrome (https://www.google.com/chrome) and re-run SnapUI.',
    );
  }
  const buildId = await resolveBuildId(BrowserKind.CHROME, platformTag, 'stable');
  const dir = managedChromeDir(platformTag, buildId);
  const exe = join(dir, chromeExecutableRel(platformTag));

  if (isValidManagedInstall(exe)) return exe;

  // Wipe any broken/partial install left behind by a previous attempt.
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  const url = chromeDownloadUrl(platformTag, buildId);
  const zipPath = join(dir, 'chrome.zip');
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.error(`[snapui] downloading managed Chrome ${buildId} (~150MB, one-time)...`);
      await downloadFile(url, zipPath);
      unpackChromeZip(zipPath, dir);
      if (isValidManagedInstall(exe)) {
        console.error('[snapui] managed Chrome installed.');
        return exe;
      }
      throw new Error('unpack verification failed — app bundle is incomplete');
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      console.error(`[snapui] managed Chrome install failed (attempt ${attempt}/${maxAttempts}): ${reason}`);
      if (attempt < maxAttempts) {
        rmSync(dir, { recursive: true, force: true });
        mkdirSync(dir, { recursive: true });
      }
    }
  }

  rmSync(dir, { recursive: true, force: true });
  throw new Error(
    'SnapUI requires Google Chrome but could not install its private copy automatically.\n' +
      'Fix it in one step: install Google Chrome from https://www.google.com/chrome and re-run SnapUI —\n' +
      'it will be detected automatically (no other browser is supported).',
  );
}

/** Navigate to a URL in an existing session if provided. */
export async function ensurePageAt(session: BrowserSession, url?: string): Promise<void> {
  if (!url) return;
  const current = session.page.url();
  if (current === 'about:blank' || !current.startsWith('http')) {
    await session.page.goto(url, { waitUntil: 'networkidle2', timeout: 45_000 });
  }
}

/** Safe teardown that never throws. */
export async function closeSession(session: BrowserSession): Promise<void> {
  try {
    if (session.owned) await session.browser.close();
    else session.browser.disconnect();
  } catch {
    /* ignore */
  }
}

/** Read the Chrome DevTools protocol port from file, if user saved it. */
export function readSavedPort(): number | null {
  const file = join(homedir(), '.snapui', 'port');
  try {
    const port = Number.parseInt(readFileSync(file, 'utf8').trim(), 10);
    return Number.isFinite(port) ? port : null;
  } catch {
    return null;
  }
}

/** Cleanly remove SnapUI directory ~/.snapui (managed Chrome binaries, ports, configs). */
export function uninstallSnapUI(): { path: string; existed: boolean } {
  const dir = join(homedir(), '.snapui');
  const existed = existsSync(dir);
  if (existed) {
    rmSync(dir, { recursive: true, force: true });
  }
  return { path: dir, existed };
}

export interface DoctorReport {
  os: string;
  arch: string;
  nodeVersion: string;
  systemChromePath: string | null;
  managedChromeDir: string;
  managedChromeExists: boolean;
  snapDir: string;
  snapDirExists: boolean;
}

/** Diagnoses SnapUI environment status for cross-platform readiness. */
export function getDoctorReport(): DoctorReport {
  const p = platform();
  const sysChrome = findChromeExecutable();
  const snapDir = join(homedir(), '.snapui');
  const managedDir = join(snapDir, 'browser');

  return {
    os: p === 'darwin' ? 'macOS' : p === 'win32' ? 'Windows' : 'Linux',
    arch: process.arch,
    nodeVersion: process.version,
    systemChromePath: sysChrome,
    managedChromeDir: managedDir,
    managedChromeExists: existsSync(managedDir),
    snapDir,
    snapDirExists: existsSync(snapDir),
  };
}
