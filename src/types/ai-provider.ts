import { ThemeJSON, Template, Pattern } from './theme';
import { ThemePrompt } from './prompt';

export interface AIProvider {
  generateThemeJSON(prompt: ThemePrompt): Promise<ThemeJSON>;
  generatePatterns(prompt: ThemePrompt, themeJson: ThemeJSON): Promise<{ patterns: Pattern[]; parts: Template[] }>;
  generateTemplates(prompt: ThemePrompt, themeJson: ThemeJSON, patternSlugs: string[], partSlugs: string[]): Promise<Template[]>;

  correctThemeJSON(errors: string[], previousOutput: string): Promise<ThemeJSON>;
  correctPatterns(errors: string[], previousOutput: string): Promise<{ patterns: Pattern[]; parts: Template[] }>;
  correctTemplates(errors: string[], previousOutput: string): Promise<Template[]>;
}

export type ProviderName = 'anthropic' | 'openrouter' | 'auto';
