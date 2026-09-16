export interface IRNode {
  tag: string;
  attrs: Record<string, string>;
  text?: string;
  styles: Record<string, string>;
  children: IRNode[];
}

export interface CaptureOptions {
  scope: 'element' | 'section';
  maxNodes?: number;
  maxDepth?: number;
}

export interface CaptureResult {
  root: IRNode;
  assets: { images: string[] };
  hint: { tag: string; classes: string[]; id?: string; textSample: string };
}

export const DEFAULT_CAPTURE: Required<CaptureOptions> = {
  scope: 'section',
  maxNodes: 400,
  maxDepth: 12,
};

export const STYLE_PROPS: string[] = [
  'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index',
  'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
  'align-items', 'align-self', 'justify-content', 'gap', 'row-gap', 'column-gap',
  'grid-template-columns', 'grid-template-rows',
  'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
  'margin', 'padding', 'box-sizing', 'overflow', 'object-fit',
  'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
  'letter-spacing', 'text-align', 'text-transform', 'text-decoration', 'color',
  'background', 'background-color', 'background-image', 'background-size',
  'background-position', 'background-repeat',
  'border', 'border-radius', 'box-shadow', 'outline', 'opacity',
  'transition', 'transform', 'filter', 'backdrop-filter', 'cursor',
  'white-space', 'aspect-ratio',
];

export const KEEP_ATTRS = new Set([
  'href', 'src', 'alt', 'srcset', 'type', 'name', 'placeholder', 'value',
  'title', 'aria-label', 'role', 'target', 'rel', 'loading', 'contenteditable',
  'for', 'action', 'method', 'viewBox', 'd', 'fill', 'stroke', 'xmlns',
]);
