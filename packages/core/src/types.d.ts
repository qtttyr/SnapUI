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
    assets: {
        images: string[];
    };
    /** Info about the picked element for naming hints. */
    hint: {
        tag: string;
        classes: string[];
        id?: string;
        textSample: string;
    };
}
export declare const DEFAULT_CAPTURE: Required<CaptureOptions>;
/** Style properties we extract (ordered for readable CSS output). */
export declare const STYLE_PROPS: string[];
/** Attributes we preserve on elements. */
export declare const KEEP_ATTRS: Set<string>;
