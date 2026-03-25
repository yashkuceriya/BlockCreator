import { ThemeJSON, ThemePrompt } from '../../types';

export function buildPatternsPrompt(
  prompt: ThemePrompt,
  themeJson: ThemeJSON
): string {
  const textDomain = prompt.name.toLowerCase().replace(/\s+/g, '-');
  const colors = themeJson.settings?.color?.palette?.map(c => c.slug).join(', ') || 'primary, secondary, accent, base, contrast';
  const fonts = themeJson.settings?.typography?.fontFamilies?.map(f => f.slug).join(', ') || 'heading, body';

  return `You are designing a visually impressive WordPress block theme. The design must look PROFESSIONAL and POLISHED — not generic or template-like.

Theme: "${prompt.name}"
Description: "${prompt.description}"
Text domain: "${textDomain}"

Available design tokens from theme.json:
- Colors: ${colors} — use via var(--wp--preset--color--SLUG)
- Fonts: ${fonts} — use via var(--wp--preset--font-family--SLUG)
- Font sizes: small, medium, large, x-large, xx-large — use via var(--wp--preset--font-size--SLUG)

Generate the following block patterns and template parts:

TEMPLATE PARTS (go in /parts/):

1. "header" — A polished site header:
   - Use wp:group with row layout for horizontal alignment
   - Include wp:site-title (styled with heading font, larger size)
   - Include wp:navigation with 4-5 realistic menu items
   - Use the theme's primary/contrast colors for backgrounds
   - Add proper padding and spacing
   - Consider a dark or colored header background with light text for impact

2. "footer" — A complete site footer:
   - Use wp:group with constrained layout
   - Include 2-3 wp:columns with useful content: site info, quick links (using wp:navigation or wp:list), and a brief about paragraph
   - Add copyright wp:paragraph at the bottom
   - Use contrasting background color (dark footer for light themes, light for dark themes)
   - Add vertical spacing between sections

PATTERNS (go in /patterns/):

1. "hero" — A VISUALLY STRIKING hero section:
   - Use wp:cover with a solid background color (use the primary or accent color)
   - LARGE heading (xx-large or x-large font size) with strong, inspiring placeholder text
   - Supporting paragraph below with medium text
   - wp:buttons with 1-2 call-to-action buttons (primary filled + secondary outlined)
   - Generous vertical padding (at least 80px top and bottom)
   - Center-aligned text
   - Make this the most visually impactful section — it sets the first impression

2. "features" — A 3-column features/services grid:
   - Use wp:columns with 3 wp:column children
   - Each column: wp:heading (h3, medium size), wp:paragraph with 2-3 sentence description
   - Use a subtle background color on each column or the section
   - Add proper padding inside each column
   - Include a section heading (h2) above the columns

3. "call-to-action" — An attention-grabbing CTA section:
   - Use wp:cover or wp:group with a bold background color
   - Large heading with compelling copy
   - Supporting paragraph
   - wp:buttons with a prominent CTA button
   - Generous padding, centered text
   - Make it visually distinct from other sections (different background color)

4. "about" — An about/intro section using wp:media-text:
   - Use wp:media-text with a placeholder wp:image on one side
   - Rich text content on the other side: heading, 2 paragraphs
   - Use proper font sizes and spacing
   - Consider a subtle background color for the section

5. "testimonials" — Social proof section:
   - Use wp:columns with 2-3 wp:column children
   - Each column: wp:group with wp:quote or wp:paragraph (italic testimonial text), wp:paragraph (person name, bold)
   - Add subtle borders or background colors to each testimonial card
   - Include a section heading above

CRITICAL RULES:
- NEVER use wp:html — hard requirement
- ALL blocks must be standard core WordPress blocks
- Use theme.json design tokens (var(--wp--preset--...)) for ALL colors, fonts, and sizes
- Create rich, nested block structures — not flat single-block patterns
- Use meaningful placeholder text that matches the theme description — not "Lorem ipsum"
- Make every pattern feel like it belongs in a cohesive, professionally designed website
- Add proper spacing attributes: {"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--60)","bottom":"var(--wp--preset--spacing--60)"}}}}

Respond with ONLY this JSON:
{
  "patterns": [
    { "slug": "hero", "title": "Hero", "categories": ["featured"], "content": "<!-- wp:... -->" }
  ],
  "parts": [
    { "slug": "header", "content": "<!-- wp:... -->" }
  ]
}`;
}

export function buildPatternsCorrectionPrompt(
  errors: string[],
  previousOutput: string
): string {
  return `Your previous patterns output had these validation errors:
${errors.map((e) => `- ${e}`).join('\n')}

Fix the errors:
- Remove any wp:html blocks — use native core blocks instead
- Ensure all blocks are properly opened and closed (matching <!-- wp:name --> and <!-- /wp:name -->)
- Ensure all JSON attributes in block comments are valid JSON
- Keep the visual quality high — don't simplify patterns to fix errors

Previous output (fix the errors):
${previousOutput}

Respond with ONLY the corrected JSON.`;
}
