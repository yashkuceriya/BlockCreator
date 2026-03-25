import { ThemeJSON, ThemePrompt } from '../../types';

export function buildTemplatesPrompt(
  prompt: ThemePrompt,
  themeJson: ThemeJSON,
  patternSlugs: string[],
  partSlugs: string[]
): string {
  const textDomain = prompt.name.toLowerCase().replace(/\s+/g, '-');
  return `Generate WordPress block templates for "${prompt.name}" (text domain: "${textDomain}").
Description: "${prompt.description}"

Available template parts: ${partSlugs.map(s => `"${s}"`).join(', ')}
Available patterns: ${patternSlugs.map(s => `"${textDomain}/${s}"`).join(', ')}

Generate these 6 templates:

1. "index" — Blog listing template:
   - Header template part
   - wp:group with constrained layout wrapping:
     - wp:query-title (h1, styled with heading font)
     - wp:query with wp:post-template containing for each post:
       - wp:post-featured-image (if available)
       - wp:post-title (as h2, linked)
       - wp:post-excerpt
       - wp:post-date (smaller, muted color)
     - wp:query-pagination below the loop
   - Footer template part

2. "home" — Front page (MUST be visually impressive):
   - Header template part
   - Reference ALL available patterns in this order: hero, features, about, call-to-action, testimonials
   - Use <!-- wp:pattern {"slug":"${textDomain}/PATTERN_SLUG"} /--> for each
   - Footer template part
   - This page should look like a complete, designed homepage

3. "single" — Single post:
   - Header template part
   - wp:group with constrained layout wrapping:
     - wp:post-featured-image (full width or wide)
     - wp:post-title (h1, large, heading font)
     - wp:group with row layout: wp:post-date + wp:post-author-name + wp:post-terms (category)
     - wp:separator
     - wp:post-content (with constrained layout)
     - wp:separator
     - wp:post-terms for tags
     - wp:comments (with wp:comment-template, wp:comment-author-name, wp:comment-content, wp:comment-date)
     - wp:post-comments-form
   - Footer template part

4. "page" — Static page:
   - Header template part
   - wp:group with constrained layout:
     - wp:post-title (h1)
     - wp:post-content
   - Footer template part

5. "archive" — Archive/category page:
   - Header template part
   - wp:group with constrained layout:
     - wp:query-title (h1)
     - wp:term-description
     - wp:query with wp:post-template: each post shows wp:post-featured-image, wp:post-title (linked), wp:post-excerpt, wp:post-date
     - wp:query-pagination
   - Footer template part

6. "404" — Not found:
   - Header template part
   - wp:group with constrained layout, centered text, generous vertical padding:
     - wp:heading "Page Not Found" (h1, large)
     - wp:paragraph "The page you're looking for doesn't exist or has been moved."
     - wp:search (with a button)
   - Footer template part

CRITICAL RULES:
- Template part syntax: <!-- wp:template-part {"slug":"header","area":"header"} /-->
- Pattern syntax: <!-- wp:pattern {"slug":"${textDomain}/hero"} /-->
- NEVER use wp:html
- Wrap main content in <!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
- Use theme.json presets for all colors and fonts
- The "home" template MUST reference all generated patterns — this is the showcase page

Respond with ONLY this JSON:
{
  "templates": [
    { "slug": "index", "content": "<!-- wp:... -->" }
  ]
}`;
}

export function buildTemplatesCorrectionPrompt(
  errors: string[],
  previousOutput: string
): string {
  return `Your previous templates output had these validation errors:
${errors.map((e) => `- ${e}`).join('\n')}

Fix the errors. NEVER use wp:html. Ensure all blocks are properly nested and closed.
Keep template structure intact — don't simplify to fix errors.

Previous output (fix the errors):
${previousOutput}

Respond with ONLY the corrected JSON.`;
}
