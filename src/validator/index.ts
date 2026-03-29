import { ALLOWED_BLOCKS, HARD_REJECTED_BLOCKS } from '../lib/constants';
import { BlockNotAllowedError, ValidationError } from '../lib/errors';
import { parseBlocks, ParsedBlock } from './block-parser';
import { ThemeJSON, Pattern } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateBlockMarkup(markup: string): ValidationResult {
  const errors: string[] = [];
  const blocks = parseBlocks(markup);

  // Check for hard-rejected blocks (wp:html)
  const rejected = blocks.filter((b) => HARD_REJECTED_BLOCKS.has(b.name));
  if (rejected.length > 0) {
    const names = [...new Set(rejected.map((b) => b.name))];
    errors.push(`HARD REJECT: Custom HTML blocks are forbidden: ${names.join(', ')}`);
  }

  // Check all blocks against allowlist
  const disallowed = blocks.filter(
    (b) => !ALLOWED_BLOCKS.has(b.name) && !HARD_REJECTED_BLOCKS.has(b.name)
  );
  if (disallowed.length > 0) {
    const names = [...new Set(disallowed.map((b) => b.name))];
    errors.push(`Blocks not in allowlist: ${names.join(', ')}`);
  }

  // Verify attribute JSON is valid
  const parseErrors = blocks.filter(
    (b) => b.attributes && '__parseError' in b.attributes
  );
  if (parseErrors.length > 0) {
    errors.push(
      `Invalid JSON attributes in blocks: ${parseErrors.map((b) => b.raw).join('; ')}`
    );
  }

  // Verify nesting balance
  const nestingErrors = checkNestingBalance(blocks);
  errors.push(...nestingErrors);

  return { valid: errors.length === 0, errors };
}

function checkNestingBalance(blocks: ParsedBlock[]): string[] {
  const errors: string[] = [];
  const stack: string[] = [];

  // Blocks are already ordered by position from parseBlocks()
  // Filter to only opening and closing blocks (not self-closing)
  const ordered = blocks.filter((b) => !b.isSelfClosing);

  for (const block of ordered) {
    if (block.isClosing) {
      if (stack.length === 0) {
        errors.push(`Unexpected closing block: ${block.name}`);
      } else {
        const expected = stack.pop();
        if (expected !== block.name) {
          errors.push(
            `Mismatched block nesting: expected closing ${expected}, got ${block.name}`
          );
        }
      }
    } else if (!block.isSelfClosing) {
      stack.push(block.name);
    }
  }

  if (stack.length > 0) {
    errors.push(`Unclosed blocks: ${stack.join(', ')}`);
  }

  return errors;
}

export function validateBlockMarkupStrict(markup: string): void {
  const result = validateBlockMarkup(markup);
  if (!result.valid) {
    const rejected = result.errors.filter((e) => e.startsWith('HARD REJECT'));
    if (rejected.length > 0) {
      throw new BlockNotAllowedError(['core/html']);
    }
    throw new ValidationError('Block markup validation failed', result.errors);
  }
}

export function validateThemeJsonStructure(json: unknown): ValidationResult {
  const errors: string[] = [];
  if (typeof json !== 'object' || json === null) {
    return { valid: false, errors: ['theme.json must be an object'] };
  }

  const obj = json as Record<string, unknown>;
  if (obj.version !== 2 && obj.version !== 3) {
    errors.push('theme.json version must be 2 or 3');
  }

  return { valid: errors.length === 0, errors };
}

function parseHexColor(color: string): [number, number, number] | null {
  const normalized = color.trim().toLowerCase();
  const match = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;

  const hex = match[1].length === 3
    ? match[1].split('').map((ch) => ch + ch).join('')
    : match[1];

  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const convert = (value: number) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * convert(r) + 0.7152 * convert(g) + 0.0722 * convert(b);
}

function contrastRatio(a: string, b: string): number | null {
  const rgbA = parseHexColor(a);
  const rgbB = parseHexColor(b);
  if (!rgbA || !rgbB) return null;

  const lumA = relativeLuminance(rgbA);
  const lumB = relativeLuminance(rgbB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

export function validateThemeDesignQuality(themeJson: ThemeJSON): ValidationResult {
  const errors: string[] = [];
  const palette = themeJson.settings?.color?.palette || [];
  const paletteMap = new Map(palette.map((entry) => [entry.slug, entry.color]));
  const typography = themeJson.settings?.typography;
  const fontFamilies = typography?.fontFamilies || [];
  const headingFont = fontFamilies.find((font) => font.slug === 'heading');
  const bodyFont = fontFamilies.find((font) => font.slug === 'body');
  const lineHeight = themeJson.styles?.typography?.lineHeight;
  const contentSize = themeJson.settings?.layout?.contentSize;

  for (const slug of ['primary', 'accent', 'base', 'contrast', 'muted']) {
    if (!paletteMap.has(slug)) {
      errors.push(`theme.json design quality: missing "${slug}" color in palette`);
    }
  }

  const baseColor = paletteMap.get('base');
  const contrastColor = paletteMap.get('contrast');
  if (baseColor && contrastColor) {
    const ratio = contrastRatio(baseColor, contrastColor);
    if (ratio !== null && ratio < 4.5) {
      errors.push(`theme.json design quality: base/contrast colors fail readability check (${ratio.toFixed(2)}:1)`);
    }
  }

  const primaryColor = paletteMap.get('primary');
  const accentColor = paletteMap.get('accent');
  if (primaryColor && accentColor && primaryColor.toLowerCase() === accentColor.toLowerCase()) {
    errors.push('theme.json design quality: primary and accent colors should not be identical');
  }

  if (!headingFont) {
    errors.push('theme.json design quality: missing heading font family');
  }

  if (!bodyFont) {
    errors.push('theme.json design quality: missing body font family');
  }

  if (headingFont && bodyFont) {
    const headingStack = headingFont.fontFamily.trim().toLowerCase();
    const bodyStack = bodyFont.fontFamily.trim().toLowerCase();
    if (headingStack === bodyStack) {
      errors.push('theme.json design quality: heading and body fonts should not use the exact same stack');
    }
    if (/\bmonospace\b/.test(bodyStack)) {
      errors.push('theme.json design quality: body font should not default to monospace');
    }
  }

  if (lineHeight) {
    const parsed = Number.parseFloat(lineHeight);
    if (!Number.isNaN(parsed) && (parsed < 1.4 || parsed > 1.9)) {
      errors.push('theme.json design quality: body line-height should stay between 1.4 and 1.9');
    }
  }

  if (contentSize) {
    const match = contentSize.match(/^(\d+)px$/);
    if (match) {
      const width = Number.parseInt(match[1], 10);
      if (width < 640 || width > 860) {
        errors.push('theme.json design quality: contentSize should stay in a readable range (640px-860px)');
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

function hasBlock(blocks: ParsedBlock[], name: string): boolean {
  return blocks.some((block) => !block.isClosing && block.name === name);
}

function extractBackgroundTreatments(blocks: ParsedBlock[]): string[] {
  return blocks
    .filter((block) => !block.isClosing)
    .flatMap((block) => {
      const treatments: string[] = [];
      if (typeof block.attributes.backgroundColor === 'string') {
        treatments.push(`bg:${block.attributes.backgroundColor}`);
      }
      if (typeof block.attributes.overlayColor === 'string') {
        treatments.push(`overlay:${block.attributes.overlayColor}`);
      }
      return treatments;
    });
}

export function validateThemeComposition(patterns: Pattern[]): ValidationResult {
  const errors: string[] = [];
  const patternBlocks = patterns.map((pattern) => ({
    slug: pattern.slug,
    blocks: parseBlocks(pattern.content),
  }));

  const layoutVariety = new Set<string>();
  const backgroundTreatments = new Set<string>();

  for (const pattern of patternBlocks) {
    if (hasBlock(pattern.blocks, 'core/cover')) layoutVariety.add('cover');
    if (hasBlock(pattern.blocks, 'core/columns')) layoutVariety.add('columns');
    if (hasBlock(pattern.blocks, 'core/media-text')) layoutVariety.add('media-text');
    if (hasBlock(pattern.blocks, 'core/gallery')) layoutVariety.add('gallery');
    if (hasBlock(pattern.blocks, 'core/details')) layoutVariety.add('details');
    if (hasBlock(pattern.blocks, 'core/query')) layoutVariety.add('query');

    extractBackgroundTreatments(pattern.blocks).forEach((treatment) => backgroundTreatments.add(treatment));
  }

  if (patterns.length >= 3 && layoutVariety.size < 2) {
    errors.push('theme composition: generated patterns need more layout variety across sections');
  }

  if (patterns.length >= 4 && backgroundTreatments.size < 2) {
    errors.push('theme composition: homepage sections should use at least two distinct background treatments');
  }

  const hero = patternBlocks.find((pattern) => pattern.slug === 'hero');
  if (hero) {
    if (!hasBlock(hero.blocks, 'core/heading')) {
      errors.push('theme composition: hero pattern should include a heading');
    }
    if (!hasBlock(hero.blocks, 'core/buttons') && !hasBlock(hero.blocks, 'core/button')) {
      errors.push('theme composition: hero pattern should include a clear call-to-action');
    }
  }

  const cta = patternBlocks.find((pattern) => pattern.slug === 'call-to-action');
  if (cta && !hasBlock(cta.blocks, 'core/buttons') && !hasBlock(cta.blocks, 'core/button')) {
    errors.push('theme composition: call-to-action pattern should include a button');
  }

  const gallery = patternBlocks.find((pattern) => pattern.slug === 'gallery');
  if (gallery && !hasBlock(gallery.blocks, 'core/gallery') && !hasBlock(gallery.blocks, 'core/image') && !hasBlock(gallery.blocks, 'core/media-text')) {
    errors.push('theme composition: gallery pattern should include visual media blocks');
  }

  const faq = patternBlocks.find((pattern) => pattern.slug === 'faq');
  if (faq && !hasBlock(faq.blocks, 'core/details')) {
    errors.push('theme composition: faq pattern should use details blocks for expandable questions');
  }

  const pricing = patternBlocks.find((pattern) => pattern.slug === 'pricing');
  if (pricing) {
    if (!hasBlock(pricing.blocks, 'core/columns')) {
      errors.push('theme composition: pricing pattern should use columns for plan comparison');
    }
    if (!hasBlock(pricing.blocks, 'core/buttons') && !hasBlock(pricing.blocks, 'core/button')) {
      errors.push('theme composition: pricing pattern should include a conversion button');
    }
  }

  return { valid: errors.length === 0, errors };
}

export { parseBlocks, extractBlockNames } from './block-parser';
