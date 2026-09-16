export const DEFAULT_CAPTURE = {
    scope: 'section',
    maxNodes: 400,
    maxDepth: 12,
};
/** Style properties we extract (ordered for readable CSS output). */
export const STYLE_PROPS = [
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
