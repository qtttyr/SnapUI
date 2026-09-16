import type { IRNode } from './types.js';
export declare function kebab(s: string): string;
export declare function pascal(s: string): string;
export declare function camel(s: string): string;
export declare function escapeHtml(s: string): string;
export declare function escapeJs(s: string): string;
/** Framework hash classes (Astro, React JSX, CSS Modules, Svelte, Angular, Styled Components). */
export declare const JUNK_CLASS_RE: RegExp;
/** Filter out framework hash junk classes from a list of class names. */
export declare function cleanClasses(classes: string[]): string[];
/**
 * Assign readable, unique class names to every node in the IR tree.
 * Root uses the component name; children use `component__tag(n)` BEM-style.
 */
export declare function assignClassNames(root: IRNode, componentName: string): void;
/** Read back the assigned class name for a node. */
export declare function classNameOf(node: IRNode): string | null;
/** Collect all nodes with assigned classes, in document order. */
export declare function classedNodes(root: IRNode): IRNode[];
