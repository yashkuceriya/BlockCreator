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

REQUIRED STRUCTURE:

1. settings.color.palette — at least 6 colors: primary, secondary, accent, base (background), contrast (foreground text), muted. Use VISUALLY DISTINCT colors that match the description, not generic grays.

2. settings.typography.fontFamilies — at least 2: one for headings, one for body. Use real font stacks like "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" or named fonts like "Georgia, serif".

3. settings.typography.fontSizes — 5 fluid sizes (small, medium, large, x-large, xx-large).

4. settings.spacing — units and spacingScale.

5. settings.layout — contentSize (e.g. "800px") and wideSize (e.g. "1200px").

6. settings.appearanceTools — true.
   settings.useRootPaddingAwareAlignments — true.

7. styles — THIS IS CRITICAL. You MUST set global styles that actually apply the palette:
   styles.color.background — use "var(--wp--preset--color--base)"
   styles.color.text — use "var(--wp--preset--color--contrast)"
   styles.typography.fontFamily — use body font via "var(--wp--preset--font-family--body)"
   styles.typography.fontSize — use "var(--wp--preset--font-size--medium)"
   styles.typography.lineHeight — e.g. "1.7"
   styles.spacing.padding — use root padding for alignment

8. styles.elements — style these elements:
   styles.elements.link.color.text — use "var(--wp--preset--color--primary)"
   styles.elements.heading.typography.fontFamily — use "var(--wp--preset--font-family--heading)"
   styles.elements.heading.color.text — use "var(--wp--preset--color--contrast)"
   styles.elements.button.color.background — use "var(--wp--preset--color--primary)"
   styles.elements.button.color.text — use "var(--wp--preset--color--base)"

9. templateParts — include: header (area: header), footer (area: footer).

The theme MUST look visually styled when activated — not like default WordPress. The background color, text color, headings, links, and buttons must all reflect the generated palette.

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
