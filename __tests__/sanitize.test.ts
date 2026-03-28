import { sanitizeThemeName, sanitizeSlug, stripMarkdownCodeFence, sanitizePatternSlug, sanitizeCategory, toPhpFunctionPrefix } from '../src/lib/sanitize';

describe('sanitizeThemeName', () => {
  test('converts spaces to hyphens and lowercases', () => {
    expect(sanitizeThemeName('My Cool Theme')).toBe('my-cool-theme');
  });

  test('removes special characters', () => {
    expect(sanitizeThemeName('Theme! @#$ 123')).toBe('theme-123');
  });

  test('trims whitespace', () => {
    expect(sanitizeThemeName('  spaces  ')).toBe('spaces');
  });

  test('truncates long names', () => {
    const long = 'a'.repeat(100);
    expect(sanitizeThemeName(long).length).toBeLessThanOrEqual(50);
  });
});

describe('sanitizeSlug', () => {
  test('produces valid slug', () => {
    expect(sanitizeSlug('Hero Section!')).toBe('hero-section');
  });
});

describe('stripMarkdownCodeFence', () => {
  test('strips json code fence', () => {
    expect(stripMarkdownCodeFence('```json\n{"key":"val"}\n```')).toBe('{"key":"val"}');
  });

  test('strips plain code fence', () => {
    expect(stripMarkdownCodeFence('```\ncode\n```')).toBe('code');
  });

  test('returns plain text unchanged', () => {
    expect(stripMarkdownCodeFence('{"key":"val"}')).toBe('{"key":"val"}');
  });
});

describe('sanitizePatternSlug', () => {
  test('allows valid slugs', () => {
    expect(sanitizePatternSlug('hero')).toBe('hero');
    expect(sanitizePatternSlug('call-to-action')).toBe('call-to-action');
  });

  test('strips invalid characters', () => {
    expect(sanitizePatternSlug('hero$section!')).toBe('hero-section');
  });

  test('handles empty/whitespace input', () => {
    expect(sanitizePatternSlug('')).toBe('untitled');
    expect(sanitizePatternSlug('   ')).toBe('untitled');
  });

  test('lowercases', () => {
    expect(sanitizePatternSlug('Hero')).toBe('hero');
  });

  test('prevents PHP comment injection via slug', () => {
    expect(sanitizePatternSlug('hero*/<?php system("rm -rf /");')).toBe('hero-php-system-rm-rf');
  });
});

describe('sanitizeCategory', () => {
  test('allows valid categories', () => {
    expect(sanitizeCategory('featured')).toBe('featured');
    expect(sanitizeCategory('call-to-action')).toBe('call-to-action');
  });

  test('strips malicious content', () => {
    expect(sanitizeCategory('featured\n * Slug: evil')).toBe('featured-slug-evil');
  });
});

describe('toPhpFunctionPrefix', () => {
  test('normal theme name', () => {
    expect(toPhpFunctionPrefix('My Cool Theme')).toBe('my_cool_theme');
  });

  test('prepends theme_ when starting with digit', () => {
    expect(toPhpFunctionPrefix('123 Theme')).toBe('theme_123_theme');
  });

  test('handles empty input', () => {
    expect(toPhpFunctionPrefix('')).toBe('theme_default');
  });

  test('handles special characters', () => {
    expect(toPhpFunctionPrefix('Café & Co.')).toBe('caf_co');
  });

  test('result is valid PHP identifier', () => {
    const prefix = toPhpFunctionPrefix('42 Wallaby Way');
    expect(prefix).toMatch(/^[a-z_][a-z0-9_]*$/);
  });
});
