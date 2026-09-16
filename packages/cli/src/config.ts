import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export interface SnapConfig {
  /** OpenAI-compatible base URL for LLM polish (optional). */
  llmBaseUrl?: string;
  llmApiKey?: string;
  llmModel?: string;
  /** Default framework / style preferences. */
  framework?: 'react' | 'vue' | 'svelte' | 'html';
  style?: 'css' | 'scss' | 'modules' | 'tailwind';
  componentsDir?: string;
}

const CONFIG_DIR = join(homedir(), '.snapui');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

export function loadConfig(): SnapConfig {
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, 'utf8')) as SnapConfig;
  } catch {
    return {};
  }
}

export function saveConfig(config: SnapConfig): void {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + '\n');
}
