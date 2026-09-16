import type { IRNode } from 'snapui-core';
import type { StyleFlavor } from './types.js';
/** Build JSX markup (React-flavored: className, self-closing voids). */
export declare function buildJsx(root: IRNode, style: StyleFlavor, indent?: number, isRoot?: boolean): string;
/** Generate a React (TSX) component file. */
export declare function generateReact(componentName: string, root: IRNode, style: StyleFlavor): string;
/** Used by vue/svelte/html generators for the module style import. */
export declare function modulePrefix(style: StyleFlavor): string;
export type { IRNode };
