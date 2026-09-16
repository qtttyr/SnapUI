import type { Page } from 'puppeteer-core';
import type { CaptureOptions, CaptureResult } from './types.js';
/** Activate the picker overlay (idempotent). */
export declare function showPicker(page: Page): Promise<void>;
/** Wait for the user's pick. Resolves with a marker, or null on Esc. */
export declare function awaitPick(page: Page): Promise<unknown>;
/**
 * Extract an IR tree from the element the user picked.
 *
 * The picked element stays INSIDE the page (window.__snapuiPickedEl) and
 * extraction runs entirely in-page — only the JSON-serializable IR result
 * crosses the CDP boundary. Never pass DOM handles between Chrome and Node:
 * recent Chrome versions serialize element handles as empty objects.
 */
export declare function extractFromPick(page: Page, _element?: unknown, options?: Partial<CaptureOptions>): Promise<CaptureResult | null>;
/** Full capture flow: show picker → wait → extract. */
export declare function capture(page: Page, options?: Partial<CaptureOptions>): Promise<CaptureResult | null>;
