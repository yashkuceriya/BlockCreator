import { AIProvider, ThemeJSON, Template, Pattern, ThemePrompt } from '../../types';

export class OpenAIProvider implements AIProvider {
  constructor() {
    throw new Error('OpenAI provider is not yet implemented. Set AI_PROVIDER=anthropic or leave unset.');
  }

  async generateThemeJSON(_prompt: ThemePrompt): Promise<ThemeJSON> {
    throw new Error('Not implemented');
  }

  async generatePatterns(_prompt: ThemePrompt, _themeJson: ThemeJSON): Promise<{ patterns: Pattern[]; parts: Template[] }> {
    throw new Error('Not implemented');
  }

  async generateTemplates(_prompt: ThemePrompt, _themeJson: ThemeJSON, _patternSlugs: string[], _partSlugs: string[]): Promise<Template[]> {
    throw new Error('Not implemented');
  }

  async correctThemeJSON(_errors: string[], _previousOutput: string): Promise<ThemeJSON> {
    throw new Error('Not implemented');
  }

  async correctPatterns(_errors: string[], _previousOutput: string): Promise<{ patterns: Pattern[]; parts: Template[] }> {
    throw new Error('Not implemented');
  }

  async correctTemplates(_errors: string[], _previousOutput: string): Promise<Template[]> {
    throw new Error('Not implemented');
  }
}
