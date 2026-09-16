import type { IRNode } from 'snapui-core';
import type { StyleFlavor } from './types.js';
/** Serialize a node's styles into ordered CSS declarations (skipping empties). */
export declare function cssDeclarations(node: IRNode): string[];
/** Generate a full CSS file for the captured tree. */
export declare function generateCss(root: IRNode, flavor: StyleFlavor): string;
