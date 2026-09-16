import type { Page } from 'puppeteer-core';
import type { CaptureOptions, CaptureResult } from './types.js';
import { DEFAULT_CAPTURE } from './types.js';
import { OVERLAY_SOURCE } from './overlay.js';
import { EXTRACT_FN_SOURCE } from './extract.js';

export async function showPicker(page: Page): Promise<void> {
  await page.evaluate(OVERLAY_SOURCE);
}

export async function awaitPick(page: Page): Promise<unknown> {
  return page.evaluate(() => {
    if (window.__snapuiPick) return window.__snapuiPick.promise;
    return window.__snapuiPickedEl ? '__snapui-picked' : null;
  });
}

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
  await page.evaluate(() => { delete window.__snapuiPickedEl; }).catch(() => {});
  return result as CaptureResult | null;
}

export async function capture(
  page: Page,
  options: Partial<CaptureOptions> = {},
): Promise<CaptureResult | null> {
  await showPicker(page);
  const picked = await awaitPick(page);
  if (!picked) return null;
  return extractFromPick(page, picked, options);
}
