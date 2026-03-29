import { ThemeJSON, ThemePrompt } from '../../types';

export function buildPatternsPrompt(
  prompt: ThemePrompt,
  themeJson: ThemeJSON
): string {
  const textDomain = prompt.name.toLowerCase().replace(/\s+/g, '-');
  const colors = themeJson.settings?.color?.palette?.map(c => c.slug).join(', ') || 'primary, secondary, accent, base, contrast';
  const fonts = themeJson.settings?.typography?.fontFamilies?.map(f => f.slug).join(', ') || 'heading, body';

  return `You are designing patterns for a VISUALLY STUNNING WordPress block theme. These patterns will be the centerpiece of the homepage — they must look like they came from a premium theme shop, not a template generator.

Theme: "${prompt.name}"
Vision: "${prompt.description}"
Text domain: "${textDomain}"

Available design tokens:
- Colors: ${colors} → use as var(--wp--preset--color--SLUG)
- Fonts: ${fonts} → use as var(--wp--preset--font-family--SLUG)
- Font sizes: small, medium, large, x-large, xx-large → use as var(--wp--preset--font-size--SLUG)
- Spacing: 30, 40, 50, 60, 70, 80 → use as var(--wp--preset--spacing--SLUG)

═══════════════════════════════════════
TEMPLATE PARTS (go in /parts/)
═══════════════════════════════════════

1. "header" — A premium site header:
   - Outer wp:group with a background color (use primary, secondary, or contrast — NOT plain white)
   - Inner wp:group with row layout {"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"} and constrained width
   - Left: wp:site-title styled with heading font, appropriate color for the background
   - Right: wp:navigation with 4-5 realistic links relevant to the theme description
   - Horizontal padding: var(--wp--preset--spacing--50), vertical: var(--wp--preset--spacing--40)
   - The header should have VISUAL PRESENCE — a colored or dark background with light text, or a distinctive border treatment
   - Apply textColor and backgroundColor attributes using palette slug names

2. "footer" — A complete, styled footer:
   - Outer wp:group with a CONTRASTING background (if header is dark, footer should also be dark or use a different dark shade)
   - Inner content with constrained layout
   - 3-column wp:columns section: Column 1: site info (wp:site-title + wp:paragraph). Column 2: navigation links (wp:heading h4 + wp:navigation or wp:list). Column 3: brief description + social links paragraph
   - Below columns: wp:separator + wp:paragraph with copyright text, smaller font size, muted color
   - Generous padding: spacing--70 top and bottom
   - The footer should feel substantial and designed — not an afterthought

═══════════════════════════════════════
PATTERNS (go in /patterns/)
═══════════════════════════════════════

1. "hero" — THE SHOWSTOPPER. This is the first thing anyone sees:
   - Use wp:cover with overlayColor set to primary or a dramatic color from the palette
   - The cover should have: {"dimRatio":100,"overlayColor":"primary","minHeight":600,"minHeightUnit":"px","isDark":true}
   - Inside the cover, center-aligned content:
     - wp:heading (h1) with xx-large font size — write a COMPELLING, SPECIFIC headline matching the theme description (not "Welcome to Our Website")
     - wp:paragraph with large font size — a supporting tagline that reinforces the theme's purpose
     - wp:buttons with 2 buttons: primary CTA (filled, bold) + secondary action (outline style using className "is-style-outline")
   - Padding: at least var(--wp--preset--spacing--80) top and bottom for an expansive feel
   - Use textColor attribute to ensure text is readable on the background
   - This pattern should make someone stop scrolling

2. "features" — A polished capabilities/services grid:
   - Outer wp:group with a DIFFERENT background than the hero (use base or muted for contrast)
   - Section wp:heading (h2) centered, with a wp:paragraph subtitle below it
   - wp:columns with 3 wp:column children, each containing:
     - wp:heading (h3) with the feature title
     - wp:paragraph with 2-3 sentences of relevant description
     - Optional: wp:buttons with a "Learn More" text-style link
   - Each column should have inner padding and optionally a subtle background (surface or base color)
   - Add gap between columns: {"style":{"spacing":{"blockGap":"var(--wp--preset--spacing--50)"}}}
   - Write placeholder content that is SPECIFIC to the theme description — if it's a restaurant theme, write about "Seasonal Menu", "Private Events", "Farm to Table"

3. "call-to-action" — A bold conversion section:
   - Use wp:cover with a DIFFERENT overlayColor than the hero (use accent, secondary, or primary)
   - Center-aligned content with generous padding (spacing--70+)
   - wp:heading (h2) with x-large or xx-large font size — compelling, action-oriented copy
   - wp:paragraph — brief supporting text that creates urgency or value
   - wp:buttons with a PROMINENT button that stands out against the cover background
   - This section should feel visually distinct from everything above and below it
   - Use textColor to ensure readability

4. "about" — A rich about/introduction section:
   - Use wp:media-text for a two-column layout with visual interest
   - Media side: wp:image with a placeholder (use {"url":"data:image/svg+xml,...","alt":"About"} or just leave sizeSlug)
   - Text side: wp:heading (h2) + 2 wp:paragraph blocks with meaningful content about the theme's subject
   - Section background: subtle color (muted or base)
   - Add padding around the entire section
   - The text should tell a STORY relevant to the theme description

5. "testimonials" — Social proof section:
   - Outer wp:group with background styling
   - Section wp:heading (h2) centered — "What People Say" or similar
   - wp:columns with 3 columns, each containing:
     - wp:group with surface/card background, padding, and border-radius: {"style":{"border":{"radius":"8px"},"spacing":{"padding":{"top":"var(--wp--preset--spacing--50)","right":"var(--wp--preset--spacing--50)","bottom":"var(--wp--preset--spacing--50)","left":"var(--wp--preset--spacing--50)"}}}}
     - Inside the group: wp:paragraph with italic testimonial text (use {"style":{"typography":{"fontStyle":"italic"}}})
     - wp:paragraph with the person's name (bold, smaller text)
   - Write testimonials that feel REAL and relevant to the theme description

═══════════════════════════════════════
CRITICAL RULES
═══════════════════════════════════════

- NEVER use wp:html — this causes immediate rejection
- ALL blocks must be standard WordPress core blocks
- Use design tokens (var(--wp--preset--...)) for ALL colors, fonts, and sizes — never hardcoded values
- Set backgroundColor and textColor attributes on wp:group and wp:cover blocks using palette SLUG NAMES (not CSS variables) for proper WordPress color resolution
- For inline styles, use the style attribute with CSS variables: {"style":{"color":{"text":"var(--wp--preset--color--base)"}}}
- Create RICH, NESTED block structures — not flat, shallow patterns
- Every pattern must have proper spacing: padding on containers, gap between children
- Placeholder text must be CONTEXTUALLY RELEVANT to "${prompt.description}" — never "Lorem ipsum"
- EVERY section should be visually distinct — vary backgrounds, spacing, and layout between patterns

REFERENCE EXAMPLE — a correctly structured hero pattern:

<!-- wp:cover {"overlayColor":"primary","minHeight":600,"minHeightUnit":"px","isDark":true,"align":"full","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--80)","bottom":"var(--wp--preset--spacing--80)","left":"var(--wp--preset--spacing--50)","right":"var(--wp--preset--spacing--50)"}}}} -->
<div class="wp-block-cover alignfull is-dark" style="min-height:600px;padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)"><span aria-hidden="true" class="wp-block-cover__background has-primary-background-color has-background-dim-100 has-background-dim"></span><div class="wp-block-cover__inner-container">
<!-- wp:group {"layout":{"type":"constrained","contentSize":"680px"}} -->
<div class="wp-block-group" style="text-align:center">
<!-- wp:heading {"level":1,"textColor":"base","fontSize":"xx-large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)","lineHeight":"1.1"}}} -->
<h1 class="wp-block-heading has-base-color has-text-color has-xx-large-font-size">Your Compelling Headline Here</h1>
<!-- /wp:heading -->
<!-- wp:paragraph {"textColor":"muted","fontSize":"large"} -->
<p class="has-muted-color has-text-color has-large-font-size">A supporting tagline that reinforces the theme purpose.</p>
<!-- /wp:paragraph -->
<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var(--wp--preset--spacing--50)"}}}} -->
<div class="wp-block-buttons">
<!-- wp:button {"backgroundColor":"accent","textColor":"primary"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-primary-color has-accent-background-color has-text-color has-background wp-element-button">Primary Action</a></div>
<!-- /wp:button -->
<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button">Secondary Action</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</div></div>
<!-- /wp:cover -->

Study this example carefully. Note:
- Block comments use <!-- wp:name {JSON} --> format
- HTML markup between open/close matches WordPress output
- backgroundColor/textColor use slug names (not CSS vars)
- style attribute uses CSS var() for spacing
- Proper class names (has-*-background-color, has-*-color, etc.)

Now generate YOUR unique patterns following this exact syntax format.

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
  return `Your previous patterns had validation errors:
${errors.map((e) => `- ${e}`).join('\n')}

Fix the errors:
- Remove any wp:html blocks — replace with native core blocks
- Ensure ALL blocks are properly opened and closed (matching <!-- wp:name --> and <!-- /wp:name -->)
- Ensure ALL JSON attributes in block comments are valid, parseable JSON
- KEEP the visual quality and design richness — do not simplify patterns just to fix errors
- Maintain all background colors, typography, and spacing

Previous output:
${previousOutput}

Respond with ONLY the corrected JSON.`;
}
