// Smoke test: launch headless Chrome, extract IR from a live page, generate a component.
// Usage: node scripts/smoke.mjs
import { launchIsolatedChrome, closeSession } from '../packages/core/dist/index.js';
import { EXTRACT_FN_SOURCE } from '../packages/core/dist/index.js';
import { assignClassNames } from '../packages/core/dist/index.js';
import { generate } from '../packages/generators/dist/index.js';

const url = process.argv[2] ?? 'https://example.com';

const session = await launchIsolatedChrome();
try {
  await session.page.goto(url, { waitUntil: 'networkidle2', timeout: 30_000 });
  await session.page.evaluate(`${EXTRACT_FN_SOURCE}; window.__snapuiExtract = __snapuiExtract;`);

  const result = await session.page.evaluate((opts) => {
    const el = document.querySelector('body') ?? document.documentElement;
    return window.__snapuiExtract(el, opts);
  }, { scope: 'section', maxNodes: 60, maxDepth: 10 });

  if (!result) throw new Error('Extraction returned null');
  console.log('✅ Extraction OK —', JSON.stringify(result.hint));
  console.log('   root tag:', result.root.tag, '| children:', result.root.children.length);
  console.log('   sample styles:', JSON.stringify(Object.keys(result.root.styles).slice(0, 8)));

  assignClassNames(result.root, 'ExampleBody');
  const files = generate({ componentName: 'ExampleBody', framework: 'react', style: 'css', root: result.root });
  for (const f of files) {
    console.log(`   → ${f.path} (${f.content.length} bytes)`);
  }
  console.log('\n✅ Smoke test passed');
} finally {
  await closeSession(session);
}
