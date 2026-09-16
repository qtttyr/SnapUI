import type { IRNode } from 'snapui-core';
import type { StyleFlavor } from './types.js';
/**
 * Build the HTML markup for the IR tree (shared by all framework generators).
 * Text is emitted as-is inside the parent element.
 */
export declare function buildMarkup(root: IRNode, style: StyleFlavor, indent?: number): string;
