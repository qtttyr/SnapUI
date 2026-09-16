import type { CaptureResult } from './types.js';

declare global {
  interface Window {
    __snapuiPick?: {
      promise: Promise<Element | null>;
      resolve: (el: Element | null) => void;
    };
    /** Picked element kept in-page (never serialized over CDP). */
    __snapuiPickedEl?: Element | null;
    __snapuiExtract?: (el: Element, opts: unknown) => CaptureResult | null;
    __snapuiPanelState?: (state: unknown) => void;
    __snapuiPanelShow?: (show: boolean) => void;
    __snapuiPanelHide?: () => void;
    __snapuiPanelAction?: (action: string) => void;
  }
}

export {};
