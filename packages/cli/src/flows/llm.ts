/**
 * Optional LLM polish step. 100% opt-in: users bring their own key
 * (OpenAI-compatible API), nothing leaves their machine otherwise.
 */
import { loadConfig } from '../config.js';

export interface PolishResult {
  ok: boolean;
  content?: string;
  error?: string;
}

export function llmConfigured(): boolean {
  const c = loadConfig();
  return Boolean(c.llmApiKey && c.llmBaseUrl && c.llmModel);
}

const SYSTEM_PROMPT = `You are a senior front-end engineer. You receive an auto-generated component
captured from a live website. Improve it: clean up naming, remove redundant styles,
improve semantic HTML, keep the visual output pixel-identical. Return ONLY the full
improved file content, no explanations, no markdown fences.`;

export async function polishCode(code: string, framework: string): Promise<PolishResult> {
  const config = loadConfig();
  if (!config.llmApiKey || !config.llmBaseUrl || !config.llmModel) {
    return { ok: false, error: 'LLM is not configured. Run `snapui config`.' };
  }

  try {
    const response = await fetch(`${config.llmBaseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.llmApiKey}`,
      },
      body: JSON.stringify({
        model: config.llmModel,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Framework: ${framework}\n\n${code}` },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      return { ok: false, error: `LLM API error ${response.status}` };
    }
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return { ok: false, error: 'Empty LLM response' };
    return { ok: true, content: content.replace(/^```[\w]*\n?|```$/g, '').trim() + '\n' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
