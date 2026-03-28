import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, ThemeJSON, Template, Pattern, ThemePrompt } from '../../types';
import { SYSTEM_PROMPT } from '../prompts/system';
import { buildThemeJsonPrompt, buildThemeJsonCorrectionPrompt, buildThemeJsonRefinementPrompt } from '../prompts/theme-json';
import { buildPatternsPrompt, buildPatternsCorrectionPrompt } from '../prompts/patterns';
import { buildTemplatesPrompt, buildTemplatesCorrectionPrompt } from '../prompts/templates';
import { stripMarkdownCodeFence } from '../../lib/sanitize';

const PROVIDER_TIMEOUT_MS = 120_000; // 2 minutes per AI call

export class AnthropicProvider implements AIProvider {
  private client: Anthropic;
  private model: string;

  constructor() {
    this.client = new Anthropic();
    this.model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
  }

  private async complete(userMessage: string): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 16384,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }, {
      timeout: PROVIDER_TIMEOUT_MS,
    });

    const textBlock = response.content.find((c) => c.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Anthropic');
    }
    return stripMarkdownCodeFence(textBlock.text);
  }

  async generateThemeJSON(prompt: ThemePrompt): Promise<ThemeJSON> {
    const userPrompt = prompt.refinementPrompt && prompt.previousThemeJson
      ? buildThemeJsonRefinementPrompt(prompt, prompt.previousThemeJson)
      : buildThemeJsonPrompt(prompt);
    const raw = await this.complete(userPrompt);
    return JSON.parse(raw) as ThemeJSON;
  }

  async generatePatterns(
    prompt: ThemePrompt,
    themeJson: ThemeJSON
  ): Promise<{ patterns: Pattern[]; parts: Template[] }> {
    const raw = await this.complete(buildPatternsPrompt(prompt, themeJson));
    return JSON.parse(raw);
  }

  async generateTemplates(
    prompt: ThemePrompt,
    themeJson: ThemeJSON,
    patternSlugs: string[],
    partSlugs: string[]
  ): Promise<Template[]> {
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
