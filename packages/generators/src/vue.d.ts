import type { IRNode } from 'snapui-core';
import type { StyleFlavor } from './types.js';
/** Generate a Vue 3 SFC with scoped styles (CSS flavors only). */
export declare function generateVue(componentName: string, root: IRNode, style: StyleFlavor): string;
