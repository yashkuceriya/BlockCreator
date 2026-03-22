import { sanitizeThemeName, sanitizeSlug, stripMarkdownCodeFence } from '../src/lib/sanitize';

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
