import type { Page } from 'puppeteer-core';
import type { CaptureOptions, CaptureResult } from './types.js';
import { DEFAULT_CAPTURE } from './types.js';
import { OVERLAY_SOURCE } from './overlay.js';
import { EXTRACT_FN_SOURCE } from './extract.js';

/** Activate the picker overlay (idempotent). */
export async function showPicker(page: Page): Promise<void> {
  await page.evaluate(OVERLAY_SOURCE);
}

/** Wait for the user's pick. Resolves with a marker, or null on Esc. */
export async function awaitPick(page: Page): Promise<unknown> {
  return page.evaluate(() => {
    // Fast path: the pick already happened before we subscribed.
    if (window.__snapuiPick) return window.__snapuiPick.promise;
    return window.__snapuiPickedEl ? '__snapui-picked' : null;
  });
}

/**
 * Extract an IR tree from the element the user picked.
 *
 * The picked element stays INSIDE the page (window.__snapuiPickedEl) and
 * extraction runs entirely in-page — only the JSON-serializable IR result
 * crosses the CDP boundary. Never pass DOM handles between Chrome and Node:
 * recent Chrome versions serialize element handles as empty objects.
 */
export async function extractFromPick(
  page: Page,
  _element?: unknown,
  options: Partial<CaptureOptions> = {},
): Promise<CaptureResult | null> {
  const opts: Required<CaptureOptions> = { ...DEFAULT_CAPTURE, ...options };
  await page.evaluate(`${EXTRACT_FN_SOURCE}; window.__snapuiExtract = __snapuiExtract;`);
  const result = await page.evaluate((o: Required<CaptureOptions>) => {
    const el = window.__snapuiPickedEl;
    if (!el || !el.tagName) {
      throw new Error(
        'SnapUI: the picked element could not be read — the page may have navigated or the element was removed. Click the element again.',
      );
    }
    return window.__snapuiExtract!(el, o);
  }, opts);
  // Drop the in-page reference; the overlay is re-injected for the next pick.
  await page.evaluate(() => { delete window.__snapuiPickedEl; }).catch(() => {});
  return result as CaptureResult | null;
}

/** Full capture flow: show picker → wait → extract. */
export async function capture(
  page: Page,
  options: Partial<CaptureOptions> = {},
): Promise<CaptureResult | null> {
  await showPicker(page);
  const picked = await awaitPick(page);
  if (!picked) return null;
  return extractFromPick(page, picked, options);
}
