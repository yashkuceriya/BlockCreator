import { AIProvider, ThemeJSON, Template, Pattern, ThemePrompt } from '../../types';
import { SYSTEM_PROMPT } from '../prompts/system';
import { buildThemeJsonPrompt, buildThemeJsonCorrectionPrompt } from '../prompts/theme-json';
import { buildPatternsPrompt, buildPatternsCorrectionPrompt } from '../prompts/patterns';
import { buildTemplatesPrompt, buildTemplatesCorrectionPrompt } from '../prompts/templates';
import { stripMarkdownCodeFence } from '../../lib/sanitize';

export class OpenRouterProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY is not set');
    }
    this.model = process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4-20250514';
  }

  private async complete(userMessage: string): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://wp-block-theme-generator.vercel.app',
        'X-Title': 'WP Block Theme Generator',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 8192,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenRouter response');
    }
    return stripMarkdownCodeFence(content);
  }

  async generateThemeJSON(prompt: ThemePrompt): Promise<ThemeJSON> {
    const raw = await this.complete(buildThemeJsonPrompt(prompt));
    return JSON.parse(raw) as ThemeJSON;
  }

  async generatePatterns(prompt: ThemePrompt, themeJson: ThemeJSON): Promise<{ patterns: Pattern[]; parts: Template[] }> {
    const raw = await this.complete(buildPatternsPrompt(prompt, themeJson));
    return JSON.parse(raw);
  }

  async generateTemplates(prompt: ThemePrompt, themeJson: ThemeJSON, patternSlugs: string[], partSlugs: string[]): Promise<Template[]> {
    const raw = await this.complete(buildTemplatesPrompt(prompt, themeJson, patternSlugs, partSlugs));
    const parsed = JSON.parse(raw);
    return parsed.templates;
  }

  async correctThemeJSON(errors: string[], previousOutput: string): Promise<ThemeJSON> {
    const raw = await this.complete(buildThemeJsonCorrectionPrompt(errors, previousOutput));
    return JSON.parse(raw) as ThemeJSON;
  }

  async correctPatterns(errors: string[], previousOutput: string): Promise<{ patterns: Pattern[]; parts: Template[] }> {
    const raw = await this.complete(buildPatternsCorrectionPrompt(errors, previousOutput));
    return JSON.parse(raw);
  }

  async correctTemplates(errors: string[], previousOutput: string): Promise<Template[]> {
    const raw = await this.complete(buildTemplatesCorrectionPrompt(errors, previousOutput));
    const parsed = JSON.parse(raw);
    return parsed.templates;
  }
}
