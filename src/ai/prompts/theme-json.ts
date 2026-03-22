import { ThemePrompt } from '../../types';

export function buildThemeJsonPrompt(prompt: ThemePrompt): string {
  let userPrompt = `Generate a complete theme.json (version 2) for a WordPress Block Theme with this description:

Theme Name: "${prompt.name}"
Description: "${prompt.description}"`;

  if (prompt.colorPreferences) {
    userPrompt += `\nColor Preferences: ${prompt.colorPreferences}`;
  }
  if (prompt.typographyPreferences) {
    userPrompt += `\nTypography Preferences: ${prompt.typographyPreferences}`;
  }
  if (prompt.layoutPreferences) {
    userPrompt += `\nLayout Preferences: ${prompt.layoutPreferences}`;
  }

  userPrompt += `

Include:
- A rich color palette (at least 6 colors including primary, secondary, accent, background, foreground, and muted variants)
- At least 2 font families (heading and body) using system fonts or common web-safe fonts
- 5 fluid font sizes (small, medium, large, x-large, xx-large)
- Sensible spacing and layout settings (contentSize, wideSize)
- Global styles for color, typography, and spacing
- Element styles for links, headings, and buttons
- templateParts array with at least: header (area: header), footer (area: footer)
- appearanceTools: true
- useRootPaddingAwareAlignments: true

Respond with ONLY the theme.json object as valid JSON. No wrapping, no explanation.`;

  return userPrompt;
}

export function buildThemeJsonCorrectionPrompt(
  errors: string[],
  previousOutput: string
): string {
  return `Your previous theme.json output had these validation errors:
${errors.map((e) => `- ${e}`).join('\n')}

Previous output (fix the errors):
${previousOutput}

Respond with ONLY the corrected theme.json object as valid JSON.`;
}
