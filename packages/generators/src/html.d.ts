import type { IRNode } from 'snapui-core';
import type { StyleFlavor } from './types.js';
/** Generate a standalone HTML fragment. */
export declare function generateHtml(componentName: string, root: IRNode, style: StyleFlavor): string;
