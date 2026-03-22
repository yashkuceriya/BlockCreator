import { AIProvider, ThemeJSON, Template, Pattern, ThemePrompt, GenerationProgress, GeneratedTheme } from '../types';
import { themeJsonSchema, patternsResponseSchema, templatesResponseSchema } from './schemas/theme-json.schema';
import { validateBlockMarkup, validateThemeJsonStructure } from '../validator';
import { mapToThemeFiles } from '../assembler';
import { withRetry } from '../lib/retry';

import { ThemeGenerationError } from '../lib/errors';

export type ProgressCallback = (progress: GenerationProgress) => void;

export class ThemeOrchestrator {
  constructor(
    private provider: AIProvider,
    private onProgress?: ProgressCallback
  ) {}

  private emit(progress: GenerationProgress) {
    this.onProgress?.(progress);
  }

  async generate(prompt: ThemePrompt): Promise<GeneratedTheme> {
    // Step 1: Generate theme.json
    this.emit({ step: 'theme-json', message: 'Generating theme.json design system...', progress: 10 });
    const themeJson = await this.generateAndValidateThemeJson(prompt);
    this.emit({ step: 'theme-json', message: 'theme.json validated successfully', progress: 30 });

    // Step 2: Generate patterns and parts
    this.emit({ step: 'patterns', message: 'Generating patterns and template parts...', progress: 35 });
    const { patterns, parts } = await this.generateAndValidatePatterns(prompt, themeJson);
    this.emit({ step: 'patterns', message: `Generated ${patterns.length} patterns and ${parts.length} parts`, progress: 60 });

    // Step 3: Generate templates
    this.emit({ step: 'templates', message: 'Generating templates...', progress: 65 });
    const patternSlugs = patterns.map((p) => p.slug);
    const partSlugs = parts.map((p) => p.slug);
    const templates = await this.generateAndValidateTemplates(prompt, themeJson, patternSlugs, partSlugs);
    this.emit({ step: 'templates', message: `Generated ${templates.length} templates`, progress: 85 });

    // Step 4: Assemble
    this.emit({ step: 'assembling', message: 'Assembling theme files...', progress: 90 });
    const files = mapToThemeFiles(prompt.name, prompt.description, themeJson, templates, patterns, parts);

    return {
      name: prompt.name,
      themeJson,
      templates,
      patterns,
      parts,
      files,
    };
  }

  private async generateAndValidateThemeJson(prompt: ThemePrompt): Promise<ThemeJSON> {
    let lastOutput = '';
    let lastErrors: string[] = [];

    return withRetry(async (attempt) => {
      let themeJson: ThemeJSON;

      if (attempt > 0 && lastErrors.length > 0) {
        this.emit({ step: 'theme-json', message: `Retrying with error correction (attempt ${attempt + 1})...`, progress: 15 });
        themeJson = await this.provider.correctThemeJSON(lastErrors, lastOutput);
      } else {
        themeJson = await this.provider.generateThemeJSON(prompt);
      }

      lastOutput = JSON.stringify(themeJson, null, 2);
      const errors: string[] = [];

      // Validate with Zod
      const zodResult = themeJsonSchema.safeParse(themeJson);
      if (!zodResult.success) {
        errors.push(...zodResult.error.issues.map((i) => i.message));
      }

      // Validate structure
      const structResult = validateThemeJsonStructure(themeJson);
      if (!structResult.valid) {
        errors.push(...structResult.errors);
      }

      if (errors.length > 0) {
        lastErrors = errors;
        throw new ThemeGenerationError(
          `theme.json validation failed: ${errors.join(', ')}`,
          'theme-json',
          errors
        );
      }

      return themeJson;
    });
  }

  private async generateAndValidatePatterns(
    prompt: ThemePrompt,
    themeJson: ThemeJSON
  ): Promise<{ patterns: Pattern[]; parts: Template[] }> {
    let lastOutput = '';
    let lastErrors: string[] = [];

    return withRetry(async (attempt) => {
      let result: { patterns: Pattern[]; parts: Template[] };

      if (attempt > 0 && lastErrors.length > 0) {
        this.emit({ step: 'patterns', message: `Retrying with error correction (attempt ${attempt + 1})...`, progress: 40 });
        result = await this.provider.correctPatterns(lastErrors, lastOutput);
      } else {
        result = await this.provider.generatePatterns(prompt, themeJson);
      }

      lastOutput = JSON.stringify(result, null, 2);
      const errors: string[] = [];

      // Validate with Zod
      const zodResult = patternsResponseSchema.safeParse(result);
      if (!zodResult.success) {
        errors.push(...zodResult.error.issues.map((i) => i.message));
      }

      // Validate each pattern's block markup
      for (const pattern of result.patterns) {
        const markupResult = validateBlockMarkup(pattern.content);
        if (!markupResult.valid) {
          errors.push(...markupResult.errors.map((e) => `Pattern "${pattern.slug}": ${e}`));
        }
      }

      // Validate each part's block markup
      for (const part of result.parts) {
        const markupResult = validateBlockMarkup(part.content);
        if (!markupResult.valid) {
          errors.push(...markupResult.errors.map((e) => `Part "${part.slug}": ${e}`));
        }
      }

      if (errors.length > 0) {
        lastErrors = errors;
        throw new ThemeGenerationError(
          `Patterns validation failed: ${errors.join('; ')}`,
          'patterns',
          errors
        );
      }

      return result;
    });
  }

  private async generateAndValidateTemplates(
    prompt: ThemePrompt,
    themeJson: ThemeJSON,
    patternSlugs: string[],
    partSlugs: string[]
  ): Promise<Template[]> {
    let lastOutput = '';
    let lastErrors: string[] = [];

    return withRetry(async (attempt) => {
      let templates: Template[];

      if (attempt > 0 && lastErrors.length > 0) {
        this.emit({ step: 'templates', message: `Retrying with error correction (attempt ${attempt + 1})...`, progress: 70 });
        templates = await this.provider.correctTemplates(lastErrors, lastOutput);
      } else {
        templates = await this.provider.generateTemplates(prompt, themeJson, patternSlugs, partSlugs);
      }

      lastOutput = JSON.stringify({ templates }, null, 2);
      const errors: string[] = [];

      // Validate with Zod
      const zodResult = templatesResponseSchema.safeParse({ templates });
      if (!zodResult.success) {
        errors.push(...zodResult.error.issues.map((i) => i.message));
      }

      // Validate each template's block markup
      for (const template of templates) {
        const markupResult = validateBlockMarkup(template.content);
        if (!markupResult.valid) {
          errors.push(...markupResult.errors.map((e) => `Template "${template.slug}": ${e}`));
        }
      }

      if (errors.length > 0) {
        lastErrors = errors;
        throw new ThemeGenerationError(
          `Templates validation failed: ${errors.join('; ')}`,
          'templates',
          errors
        );
      }

      return templates;
    });
  }
}
