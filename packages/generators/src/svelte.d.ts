import type { IRNode } from 'snapui-core';
import type { StyleFlavor } from './types.js';
/** Generate a Svelte component. */
export declare function generateSvelte(componentName: string, root: IRNode, style: StyleFlavor): string;
