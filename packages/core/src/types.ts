/** Neutral representation of a captured DOM subtree. All generators consume this. */
export interface IRNode {
  /** Lowercased tag name, or '#text' for text nodes. */
  tag: string;
  /** Attributes worth keeping (id excluded — we generate classes). */
  attrs: Record<string, string>;
  /** Text content for '#text' nodes (trimmed). */
  text?: string;
  /** Cleaned computed styles (defaults pruned, relevant props only). */
  styles: Record<string, string>;
  children: IRNode[];
}

/** Options controlling how deep / wide we capture. */
export interface CaptureOptions {
  /** 'element' — just the node; 'section' — node + full subtree (capped). */
  scope: 'element' | 'section';
  /** Hard cap on nodes captured (safety valve for huge pages). */
  maxNodes?: number;
  /** Hard cap on tree depth. */
  maxDepth?: number;
}

/** Result of a capture session. */
export interface CaptureResult {
  root: IRNode;
  /** Assets referenced (images, fonts) — URLs to download or inline. */
  assets: { images: string[] };
  /** Info about the picked element for naming hints. */
  hint: { tag: string; classes: string[]; id?: string; textSample: string };
}

export const DEFAULT_CAPTURE: Required<CaptureOptions> = {
  scope: 'section',
  maxNodes: 400,
  maxDepth: 12,
};

/** Style properties we extract (ordered for readable CSS output). */
export const STYLE_PROPS: string[] = [
  // box model
  'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index',
  'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
  'align-items', 'align-self', 'justify-content', 'gap', 'row-gap', 'column-gap',
  'grid-template-columns', 'grid-template-rows',
  'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
  'margin', 'padding', 'box-sizing', 'overflow', 'object-fit',
  // typography
  'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
  'letter-spacing', 'text-align', 'text-transform', 'text-decoration', 'color',
  // visual
  'background', 'background-color', 'background-image', 'background-size',
  'background-position', 'background-repeat',
  'border', 'border-radius', 'box-shadow', 'outline', 'opacity',
  'transition', 'transform', 'filter', 'backdrop-filter', 'cursor',
  'white-space', 'aspect-ratio',
];

/** Attributes we preserve on elements. */
export const KEEP_ATTRS = new Set([
  'href', 'src', 'alt', 'srcset', 'type', 'name', 'placeholder', 'value',
  'title', 'aria-label', 'role', 'target', 'rel', 'loading', 'contenteditable',
  'for', 'action', 'method', 'viewBox', 'd', 'fill', 'stroke', 'xmlns',
]);
