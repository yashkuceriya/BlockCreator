import { AIProvider, ThemeJSON, Template, Pattern, ThemePrompt, GenerationProgress, GeneratedTheme } from '../types';
import { themeJsonSchema, patternsResponseSchema, templatesResponseSchema } from './schemas/theme-json.schema';
import {
  validateBlockMarkup,
  validateThemeJsonStructure,
  validateThemeDesignQuality,
  validateThemeComposition,
  parseBlocks,
} from '../validator';
import { mapToThemeFiles } from '../assembler';
import { withRetry } from '../lib/retry';
import { ThemeGenerationError } from '../lib/errors';
import { REQUIRED_PARTS, REQUIRED_TEMPLATES } from '../lib/constants';
import { sanitizeCategory, sanitizePatternSlug, sanitizeSlug, toThemeTextDomain } from '../lib/sanitize';

export type ProgressCallback = (progress: GenerationProgress) => void;

function findDuplicateSlugs(slugs: string[]): string[] {
  return Array.from(
    slugs.reduce((duplicates, slug, index) => {
      if (slugs.indexOf(slug) !== index) duplicates.add(slug);
      return duplicates;
    }, new Set<string>())
  );
}

function normalizePatternsResult(result: { patterns: Pattern[]; parts: Template[] }): { patterns: Pattern[]; parts: Template[] } {
  return {
    patterns: result.patterns.map((pattern) => ({
      ...pattern,
      slug: sanitizePatternSlug(pattern.slug),
      title: pattern.title?.trim() || sanitizePatternSlug(pattern.slug).replace(/-/g, ' '),
      categories: pattern.categories.map(sanitizeCategory),
    })),
    parts: result.parts.map((part) => ({
      ...part,
      slug: sanitizeSlug(part.slug),
    })),
  };
}

function normalizeTemplates(templates: Template[]): Template[] {
  return templates.map((template) => ({
    ...template,
    slug: sanitizeSlug(template.slug),
  }));
}

function extractReferencedSlugs(markup: string, blockName: string): string[] {
  return parseBlocks(markup)
    .filter((block) => !block.isClosing && block.name === blockName && typeof block.attributes.slug === 'string')
    .map((block) => String(block.attributes.slug));
}

function validatePatternsAndParts(themeJson: ThemeJSON, patterns: Pattern[], parts: Template[]): string[] {
  const errors: string[] = [];
  const patternSlugs = patterns.map((pattern) => pattern.slug);
  const partSlugs = parts.map((part) => part.slug);

  const duplicatePatterns = findDuplicateSlugs(patternSlugs);
  if (duplicatePatterns.length > 0) {
    errors.push(`Duplicate pattern slugs: ${duplicatePatterns.join(', ')}`);
  }

  const duplicateParts = findDuplicateSlugs(partSlugs);
  if (duplicateParts.length > 0) {
    errors.push(`Duplicate template part slugs: ${duplicateParts.join(', ')}`);
  }

  const missingParts = REQUIRED_PARTS.filter((slug) => !partSlugs.includes(slug));
  if (missingParts.length > 0) {
    errors.push(`Missing required template parts: ${missingParts.join(', ')}`);
  }

  const declaredParts = new Set((themeJson.templateParts || []).map((part) => sanitizeSlug(part.name)));
  const missingDeclaredParts = REQUIRED_PARTS.filter((slug) => !declaredParts.has(slug));
  if (missingDeclaredParts.length > 0) {
    errors.push(`theme.json is missing required templateParts entries: ${missingDeclaredParts.join(', ')}`);
  }

  return errors;
}

function validateTemplates(
  templates: Template[],
  patternSlugs: string[],
  partSlugs: string[],
  themeName: string
): string[] {
  const errors: string[] = [];
  const templateSlugs = templates.map((template) => template.slug);
  const duplicateTemplates = findDuplicateSlugs(templateSlugs);
  if (duplicateTemplates.length > 0) {
    errors.push(`Duplicate template slugs: ${duplicateTemplates.join(', ')}`);
  }

  const missingTemplates = REQUIRED_TEMPLATES.filter((slug) => !templateSlugs.includes(slug));
  if (missingTemplates.length > 0) {
    errors.push(`Missing required templates: ${missingTemplates.join(', ')}`);
  }

  const textDomain = toThemeTextDomain(themeName);
  const expectedPatternRefs = new Set(patternSlugs.map((slug) => `${textDomain}/${slug}`));
  const partSet = new Set(partSlugs);

  for (const template of templates) {
    const referencedParts = extractReferencedSlugs(template.content, 'core/template-part').map(sanitizeSlug);
    const referencedPatterns = extractReferencedSlugs(template.content, 'core/pattern');

    const unknownParts = referencedParts.filter((slug) => !partSet.has(slug));
    if (unknownParts.length > 0) {
      errors.push(`Template "${template.slug}" references unknown template parts: ${unknownParts.join(', ')}`);
    }

    const unknownPatterns = referencedPatterns.filter((slug) => !expectedPatternRefs.has(slug));
    if (unknownPatterns.length > 0) {
      errors.push(`Template "${template.slug}" references unknown patterns: ${unknownPatterns.join(', ')}`);
    }

    if (REQUIRED_TEMPLATES.includes(template.slug as typeof REQUIRED_TEMPLATES[number])) {
      if (!referencedParts.includes('header')) {
        errors.push(`Template "${template.slug}" is missing the header template part`);
      }
      if (!referencedParts.includes('footer')) {
        errors.push(`Template "${template.slug}" is missing the footer template part`);
      }
    }
  }

  const homeTemplate = templates.find((template) => template.slug === 'home');
  if (homeTemplate) {
    const homePatternRefs = extractReferencedSlugs(homeTemplate.content, 'core/pattern');
    const homePatterns = new Set(homePatternRefs);
    const missingHomePatterns = Array.from(expectedPatternRefs).filter((slug) => !homePatterns.has(slug));
    if (missingHomePatterns.length > 0) {
      errors.push(`Home template is missing generated patterns: ${missingHomePatterns.join(', ')}`);
    }

    if (patternSlugs.includes('hero')) {
      const expectedHero = `${textDomain}/hero`;
      if (homePatternRefs[0] !== expectedHero) {
        errors.push('Home template should lead with the hero pattern when one is generated');
      }
    }

    if (homePatternRefs.length < Math.min(patternSlugs.length, 3)) {
      errors.push('Home template should present a fuller section flow; too few pattern references were found');
    }
  }

  return errors;
}

export class ThemeOrchestrator {
  constructor(
    private provider: AIProvider,
    private onProgress?: ProgressCallback
  ) {}

  private emit(progress: GenerationProgress) {
    this.onProgress?.(progress);
  }

  async generate(prompt: ThemePrompt): Promise<GeneratedTheme> {
    const isRefinement = !!(prompt.refinementPrompt && prompt.previousThemeJson);

    // Step 1: Generate theme.json
    this.emit({
      step: 'theme-json',
      message: isRefinement ? 'Refining theme.json with your changes...' : 'Generating theme.json design system...',
      progress: 10,
    });
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
    const compositionResult = validateThemeComposition(patterns);
    if (!compositionResult.valid) {
      throw new ThemeGenerationError(
        `Theme composition validation failed: ${compositionResult.errors.join('; ')}`,
        'templates',
        compositionResult.errors
      );
    }
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

      const qualityResult = validateThemeDesignQuality(themeJson);
      if (!qualityResult.valid) {
        errors.push(...qualityResult.errors);
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

      result = normalizePatternsResult(result);

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

      errors.push(...validatePatternsAndParts(themeJson, result.patterns, result.parts));

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

      templates = normalizeTemplates(templates);

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

      errors.push(...validateTemplates(templates, patternSlugs, partSlugs, prompt.name));

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
