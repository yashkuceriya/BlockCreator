import { ThemeJSON, ThemePrompt } from '../../types';

export function buildTemplatesPrompt(
  prompt: ThemePrompt,
  themeJson: ThemeJSON,
  patternSlugs: string[],
  partSlugs: string[]
): string {
  const textDomain = prompt.name.toLowerCase().replace(/\s+/g, '-');
  return `Given this theme.json:
${JSON.stringify(themeJson, null, 2)}

Available template parts (reference via wp:template-part): ${partSlugs.join(', ')}
Available patterns (reference via wp:pattern): ${patternSlugs.map((s) => `${textDomain}/${s}`).join(', ')}

Generate WordPress block templates for the theme "${prompt.name}" (text domain: "${textDomain}").

Generate these templates using ONLY native WordPress blocks (NEVER wp:html):

1. "index" — Main template: header part, query loop with post-template, pagination, footer part
2. "home" — Front page: header part, hero pattern, features pattern, call-to-action pattern, footer part
3. "single" — Single post: header part, post-title, post-featured-image, post-content, post-terms, comments, footer part
4. "page" — Page template: header part, page content (post-title + post-content), footer part
5. "archive" — Archive: header part, query-title, query loop, pagination, footer part
6. "404" — 404 page: header part, heading "Page Not Found", paragraph, search block, footer part

IMPORTANT:
- Reference template parts: <!-- wp:template-part {"slug":"header","area":"header"} /-->
- Reference patterns: <!-- wp:pattern {"slug":"${textDomain}/hero"} /-->
- Wrap main content areas in <!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
- Use theme.json presets via CSS custom properties
- NEVER use wp:html
- Each template must be complete and self-contained

Respond with ONLY this JSON:
{
  "templates": [
    { "slug": "index", "content": "<!-- wp:... markup -->" }
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

Previous output (fix the errors):
${previousOutput}

Respond with ONLY the corrected JSON.`;
}
