import { ThemeJSON, Template, Pattern, ThemeFiles } from '../types';
import { generateStyleCSS } from './style-css';
import { generateFunctionsPHP } from './functions-php';
import {
  escapeForComment,
  escapeForPHPString,
  sanitizePatternSlug,
  sanitizeCategory,
  toThemeTextDomain,
} from '../lib/sanitize';

export function mapToThemeFiles(
  themeName: string,
  description: string,
  themeJson: ThemeJSON,
  templates: Template[],
  patterns: Pattern[],
  parts: Template[]
): ThemeFiles {
  const files: ThemeFiles = {
    'style.css': generateStyleCSS(themeName, description),
    'theme.json': JSON.stringify(themeJson, null, 2),
    'functions.php': generateFunctionsPHP(themeName),
    'readme.txt': generateReadmeTxt(themeName, description),
    templates: {},
    parts: {},
    patterns: {},
  };

  for (const template of templates) {
    files.templates[`${template.slug}.html`] = template.content;
  }

  for (const part of parts) {
    files.parts[`${part.slug}.html`] = part.content;
  }

  for (const pattern of patterns) {
    const safeSlug = sanitizePatternSlug(pattern.slug);
    files.patterns[`${safeSlug}.php`] = wrapPatternPHP(pattern, themeName);
  }

  return files;
}

function wrapPatternPHP(pattern: Pattern, themeName: string): string {
  const textDomain = toThemeTextDomain(themeName);
  const safeTitle = escapeForComment(pattern.title);
  const safeTextDomain = escapeForPHPString(textDomain);
  const safeSlug = sanitizePatternSlug(pattern.slug);
  const safeCategories = pattern.categories.map(sanitizeCategory).join(', ');
  return `<?php
/**
 * Title: ${safeTitle}
 * Slug: ${safeTextDomain}/${safeSlug}
 * Categories: ${safeCategories}
 */
?>
${pattern.content}
`;
}

function generateReadmeTxt(themeName: string, description: string): string {
  return `=== ${themeName} ===

Contributors: wpblockthemegenerator
Requires at least: 6.2
Tested up to: 6.5
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

${description}

== Description ==

${description}

== Changelog ==

= 1.0.0 =
* Initial release
`;
}
