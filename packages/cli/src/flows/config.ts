import * as p from '@clack/prompts';
import pc from 'picocolors';
import { loadConfig, saveConfig, type SnapConfig } from '../config.js';

/** Interactive config view / edit. */
export async function showConfig(): Promise<void> {
  const config = loadConfig();

  p.log.info(
    `Current config ${pc.dim('(~/.snapui/config.json)')}:\n` +
      Object.entries(config)
        .map(([k, v]) => `  ${pc.cyan(k)}: ${k.toLowerCase().includes('key') ? '••••' + String(v).slice(-4) : v}`)
        .join('\n') || '  (empty)',
  );

  const action = await p.select({
    message: 'What do you want to configure?',
    options: [
      { value: 'llm', label: 'LLM polish — bring your own key (OpenAI-compatible)' },
      { value: 'defaults', label: 'Defaults — framework & styling' },
      { value: 'reset', label: 'Reset config' },
    ],
  });
  if (p.isCancel(action)) return;

  const updated: SnapConfig = { ...config };

  if (action === 'llm') {
    const baseUrl = await p.text({
      message: 'Base URL (e.g. https://api.openai.com/v1 or http://localhost:11434/v1 for Ollama)',
      placeholder: 'https://api.openai.com/v1',
      initialValue: config.llmBaseUrl,
    });
    if (!p.isCancel(baseUrl)) updated.llmBaseUrl = baseUrl as string;

    const key = await p.password({ message: 'API key' });
    if (!p.isCancel(key)) updated.llmApiKey = key as string;

    const model = await p.text({
      message: 'Model',
      placeholder: 'gpt-4o-mini',
      initialValue: config.llmModel,
    });
    if (!p.isCancel(model)) updated.llmModel = model as string;
  } else if (action === 'defaults') {
    const framework = await p.select({
      message: 'Default framework',
      initialValue: config.framework ?? 'react',
      options: [
        { value: 'react', label: 'React (TSX)' },
        { value: 'vue', label: 'Vue 3' },
        { value: 'svelte', label: 'Svelte' },
        { value: 'html', label: 'HTML' },
      ],
    });
    if (!p.isCancel(framework)) updated.framework = framework as SnapConfig['framework'];

    const style = await p.select({
      message: 'Default styling',
      initialValue: config.style ?? 'css',
      options: [
        { value: 'css', label: 'CSS' },
        { value: 'scss', label: 'SCSS' },
        { value: 'modules', label: 'CSS Modules' },
        { value: 'tailwind', label: 'Tailwind' },
      ],
    });
    if (!p.isCancel(style)) updated.style = style as SnapConfig['style'];
  } else if (action === 'reset') {
    saveConfig({});
    p.log.success('Config reset.');
    return;
  }

  saveConfig(updated);
  p.outro(pc.green('✔ Saved to ~/.snapui/config.json'));
}
