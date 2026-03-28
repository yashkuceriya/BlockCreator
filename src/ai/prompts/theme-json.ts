import { ThemePrompt } from '../../types';

export function buildThemeJsonPrompt(prompt: ThemePrompt): string {
  let userPrompt = `Design a complete theme.json (version 2) for a WordPress Block Theme.

Theme Name: "${prompt.name}"
Vision: "${prompt.description}"`;

  if (prompt.colorPreferences) {
    userPrompt += `\nColor Direction: ${prompt.colorPreferences}`;
  }
  if (prompt.typographyPreferences) {
    userPrompt += `\nTypography Direction: ${prompt.typographyPreferences}`;
  }
  if (prompt.layoutPreferences) {
    userPrompt += `\nLayout Direction: ${prompt.layoutPreferences}`;
  }

  userPrompt += `

REQUIRED STRUCTURE — follow this exactly:

1. settings.color.palette — Design a cohesive, intentional palette. Include AT LEAST these 6 colors:
   - "primary" — the dominant brand color. Pick something bold and specific (not generic blue #0000ff).
   - "secondary" — a complementary color that supports the primary. Use color theory.
   - "accent" — a highlight/pop color for CTAs and emphasis. Should contrast with primary.
   - "base" — the main background color. Can be white, off-white, dark, or tinted.
   - "contrast" — the main text color. Must be readable against base (WCAG AA minimum).
   - "muted" — a subtle variant for secondary text, borders, and backgrounds.
   Additional colors encouraged: "surface" for card backgrounds, "highlight" for hover states.

   COLOR QUALITY: Colors must feel curated and professional. Study the theme description and choose colors that evoke the right emotion. A photography portfolio might use charcoal + warm white + gold accent. A SaaS product might use deep navy + white + electric blue. A food blog might use cream + terracotta + sage green. Be SPECIFIC and INTENTIONAL.

2. settings.typography.fontFamilies — Choose AT LEAST 2 font families:
   - "heading" — an expressive display font for headings. Match the theme mood.
     For editorial/luxury: use serif like "Playfair Display, Georgia, serif" or "Fraunces, serif"
     For modern/tech: use geometric sans like "Inter, system-ui, sans-serif" or "Space Grotesk, sans-serif"
     For creative/playful: use distinctive fonts like "DM Serif Display, serif" or "Sora, sans-serif"
   - "body" — a highly readable font for body text. Prioritize legibility.
     Good choices: "Inter, system-ui, sans-serif", "Source Sans 3, sans-serif", "Literata, Georgia, serif"

   Each font MUST include fontFamily (full stack with fallbacks), slug, and name.

3. settings.typography.fontSizes — 5 fluid sizes using clamp():
   - "small": clamp(0.8rem, 0.77rem + 0.15vw, 0.9rem)
   - "medium": clamp(1rem, 0.95rem + 0.25vw, 1.125rem)
   - "large": clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)
   - "x-large": clamp(1.75rem, 1.4rem + 1.75vw, 2.75rem)
   - "xx-large": clamp(2.5rem, 1.75rem + 3.75vw, 4.5rem)

4. settings.spacing — Include spacingScale: { operator: "*", increment: 1.5, mediumStep: 1.5, steps: 7, unit: "rem" }

5. settings.layout — contentSize (between "700px" and "800px" for reading comfort) and wideSize ("1200px").

6. settings.appearanceTools: true
   settings.useRootPaddingAwareAlignments: true

7. styles — THIS IS CRITICAL. The theme must look styled immediately on activation:
   - styles.color.background: "var(--wp--preset--color--base)"
   - styles.color.text: "var(--wp--preset--color--contrast)"
   - styles.typography.fontFamily: "var(--wp--preset--font-family--body)"
   - styles.typography.fontSize: "var(--wp--preset--font-size--medium)"
   - styles.typography.lineHeight: "1.7"
   - styles.spacing.padding: { "top": "0", "right": "var(--wp--preset--spacing--50)", "bottom": "0", "left": "var(--wp--preset--spacing--50)" }

8. styles.elements — Style these for immediate visual polish:
   - link: color.text "var(--wp--preset--color--primary)", hover decoration
   - heading: typography.fontFamily "var(--wp--preset--font-family--heading)", color.text "var(--wp--preset--color--contrast)", typography.lineHeight "1.2", typography.fontWeight "700"
   - button: color.background "var(--wp--preset--color--primary)", color.text "var(--wp--preset--color--base)", border.radius "6px", typography.fontWeight "600"
   - caption: color.text "var(--wp--preset--color--muted)", typography.fontSize "var(--wp--preset--font-size--small)"

9. templateParts: [{ "name": "header", "area": "header" }, { "name": "footer", "area": "footer" }]

The theme.json must produce a theme that looks PROFESSIONALLY DESIGNED from the moment it's activated. Not default WordPress. Not generic. A theme that makes people say "this was AI generated?"

Respond with ONLY the theme.json as valid JSON.`;

  return userPrompt;
}

export function buildThemeJsonRefinementPrompt(
  prompt: ThemePrompt,
  previousThemeJson: string
): string {
  return `You previously generated this theme.json for "${prompt.name}":

${previousThemeJson}

The user wants to REFINE this theme with the following instruction:
"${prompt.refinementPrompt}"

Apply the refinement while keeping everything else intact. Only change what the user asked for.
If they ask for color changes, update the palette and any styles referencing those colors.
If they ask for typography changes, update fontFamilies and related styles.
If they ask for spacing/layout changes, update the relevant settings.

Maintain the same structure and quality. The theme must still look professionally designed.

Respond with ONLY the updated theme.json as valid JSON.`;
}

export function buildThemeJsonCorrectionPrompt(
  errors: string[],
  previousOutput: string
): string {
  return `Your previous theme.json had validation errors:
${errors.map((e) => `- ${e}`).join('\n')}

Fix these errors while keeping the design quality high. Do not simplify the design.

Previous output:
${previousOutput}

Respond with ONLY the corrected theme.json as valid JSON.`;
}
