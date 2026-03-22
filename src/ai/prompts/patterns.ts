import { ThemeJSON, ThemePrompt } from '../../types';

export function buildPatternsPrompt(
  prompt: ThemePrompt,
  themeJson: ThemeJSON
): string {
  const textDomain = prompt.name.toLowerCase().replace(/\s+/g, '-');
  return `Given this theme.json design system:
${JSON.stringify(themeJson, null, 2)}

Generate WordPress block patterns and template parts for the theme "${prompt.name}" (text domain: "${textDomain}").
Description: "${prompt.description}"

Generate the following as block markup using ONLY native WordPress blocks (NEVER wp:html):

Template Parts (these go in /parts/):
1. "header" — site header with site-title, site-tagline, and navigation
2. "footer" — site footer with paragraph copyright text and social-links

Patterns (these go in /patterns/):
1. "hero" — hero section with heading, paragraph, and buttons. Use a cover or group block.
2. "call-to-action" — CTA section with heading, paragraph, and button
3. "features" — features/services section with columns (3 columns, each with heading + paragraph)
4. "about" — about section with media-text block (image + text)
5. "testimonials" — testimonials with columns of quotes

IMPORTANT:
- Use theme.json color presets via var(--wp--preset--color--slug)
- Use theme.json font size presets via var(--wp--preset--font-size--slug)
- Use theme.json spacing presets where available
- ALL blocks must be from the core allowlist. NEVER use wp:html.
- Make the content rich and visually appealing with proper nesting.

Respond with ONLY this JSON structure:
{
  "patterns": [
    { "slug": "hero", "title": "Hero", "categories": ["featured"], "content": "<!-- wp:... markup -->" }
  ],
  "parts": [
    { "slug": "header", "content": "<!-- wp:... markup -->" }
  ]
}`;
}

export function buildPatternsCorrectionPrompt(
  errors: string[],
  previousOutput: string
): string {
  return `Your previous patterns output had these validation errors:
${errors.map((e) => `- ${e}`).join('\n')}

Fix the errors. Common issues:
- Remove any wp:html blocks — use native blocks instead
- Ensure all blocks are properly opened and closed
- Ensure all JSON attributes in block comments are valid JSON

Previous output (fix the errors):
${previousOutput}

Respond with ONLY the corrected JSON.`;
}
