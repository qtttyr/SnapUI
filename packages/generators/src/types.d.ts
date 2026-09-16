/** Output styling flavors supported by the style engine. */
export type StyleFlavor = 'css' | 'scss' | 'modules' | 'tailwind';
/** Output frameworks supported by the markup generators. */
export type Framework = 'react' | 'vue' | 'svelte' | 'html';
/** Everything a generator needs to produce files. */
export interface GenerateInput {
    componentName: string;
    framework: Framework;
    style: StyleFlavor;
    /** IR root with `data-snap-class` names assigned (see snapui-core naming). */
    root: import('snapui-core').IRNode;
    /** Hint text captured from the picked element. */
    textSample?: string;
}
/** A single generated file, ready to write to disk. */
export interface GeneratedFile {
    /** Relative path like 'components/HeroSection.tsx'. */
    path: string;
    content: string;
}
