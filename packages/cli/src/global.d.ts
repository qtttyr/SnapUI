import type {} from '@snapui/core';

declare global {
  interface Window {
    __snapuiPanelState?: (state: unknown) => void;
    __snapuiPanelShow?: (show: boolean) => void;
    __snapuiPanelHide?: () => void;
    __snapuiPanelAction?: (action: string) => void;
    __snapuiPick?: { promise: Promise<Element | null>; resolve: (el: Element | null) => void };
    __snapuiExtract?: (el: Element, opts: unknown) => unknown;
  }
}

export {};
