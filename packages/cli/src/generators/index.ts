export * from './types.js';
export { generateCss, cssDeclarations } from './style-engine.js';
export { tailwindClasses } from './tailwind.js';
export { buildMarkup } from './markup.js';

import { pascal } from '../core/naming.js';
import type { GenerateInput, GeneratedFile } from './types.js';
import { generateReact } from './react.js';
import { generateVue } from './vue.js';
import { generateSvelte } from './svelte.js';
import { generateHtml } from './html.js';
import { generateCss } from './style-engine.js';

function kebab(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function generate(input: GenerateInput): GeneratedFile[] {
  const name = pascal(input.componentName);
  const fileBase = kebab(name);
  const files: GeneratedFile[] = [];

  switch (input.framework) {
    case 'react':
      files.push({ path: `components/${name}.tsx`, content: generateReact(name, input.root, input.style) });
      if (input.style === 'modules') {
        files.push({ path: `styles/${fileBase}.module.css`, content: generateCss(input.root, 'modules') });
      } else if (input.style !== 'tailwind') {
        files.push({ path: `styles/${fileBase}.css`, content: generateCss(input.root, input.style) });
      }
      break;
    case 'vue':
      files.push({ path: `components/${name}.vue`, content: generateVue(name, input.root, input.style) });
      if (input.style !== 'tailwind') {
        files.push({ path: `styles/${fileBase}.css`, content: generateCss(input.root, input.style) });
      }
      break;
    case 'svelte':
      files.push({ path: `components/${name}.svelte`, content: generateSvelte(name, input.root, input.style) });
      if (input.style !== 'tailwind') {
        files.push({ path: `styles/${fileBase}.css`, content: generateCss(input.root, input.style) });
      }
      break;
    case 'html':
      files.push({ path: `components/${fileBase}.html`, content: generateHtml(name, input.root, input.style) });
      if (input.style !== 'tailwind') {
        files.push({ path: `styles/${fileBase}.css`, content: generateCss(input.root, input.style) });
      }
      break;
  }

  if (input.framework === 'react') {
    files.push({ path: `storybook/${name}.stories.tsx`, content: generateStories(name) });
  }

  return files;
}

export function generateStories(name: string): string {
  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from '../components/${name}';

const meta: Meta<typeof ${name}> = {
  title: 'SnapUI/${name}',
  component: ${name},
};

export default meta;
export type Story = StoryObj<typeof ${name}>;

export const Default: Story = {};
`;
}
