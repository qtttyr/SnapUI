import type { IRNode, CaptureOptions } from './types.js';

declare global {
  interface Window {
    __snapuiPick?: {
      promise: Promise<unknown>;
      resolve: (val: unknown) => void;
    };
    __snapuiPickedEl?: Element | null;
    __snapuiExtract?: (el: Element, opts: Required<CaptureOptions>) => any;
    __snapuiPanelState?: (state: any) => void;
    __snapuiPanelShow?: (show: boolean) => void;
    __snapuiPanelAction?: (actionJson: string) => void;
  }
}

export {};
