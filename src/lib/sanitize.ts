export function sanitizeThemeName(name: string): string {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 50);
}

export function sanitizeSlug(slug: string): string {
  return slug
    .trim()
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export function escapeForComment(text: string): string {
  return text.replace(/\*\//g, '* /').replace(/\*\\/g, '* \\');
}

export function escapeForPHPString(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Sanitize a pattern slug from AI output.
 * Only allows lowercase alphanumeric and hyphens.
 */
export function sanitizePatternSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100) || 'untitled';
}

export function toThemeTextDomain(themeName: string): string {
  return sanitizeThemeName(themeName) || 'theme';
}

/**
 * Sanitize a pattern category from AI output.
 * Only allows lowercase alphanumeric, hyphens, and underscores.
 */
export function sanitizeCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) || 'featured';
}

/**
 * Generate a valid PHP function prefix from a theme name.
 * PHP identifiers must match [a-zA-Z_][a-zA-Z0-9_]*.
 * We prepend 'theme_' if the result starts with a digit.
 */
export function toPhpFunctionPrefix(themeName: string): string {
  const base = themeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  // PHP functions can't start with a digit
  if (!base || /^[0-9]/.test(base)) {
    return `theme_${base || 'default'}`;
  }

  return base;
}

export function stripMarkdownCodeFence(text: string): string {
  return text
    .replace(/^```(?:json|html|php|text)?\s*\n?/gm, '')
    .replace(/\n?```\s*$/gm, '')
    .trim();
}
