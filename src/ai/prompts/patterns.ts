import {
  ThemeJSON,
  ThemePrompt,
  ThemeSectionOption,
  resolveGenerationOptions,
} from '../../types';
import { toThemeTextDomain } from '../../lib/sanitize';

const SECTION_INSTRUCTIONS: Record<ThemeSectionOption, string> = {
  hero: `"hero" — The showstopping opening section:
   - Use wp:cover or a visually rich wp:group with full-width treatment
   - Include a compelling h1, supporting paragraph, and 1-2 CTA buttons
   - Make it specific to the theme vision, not generic marketing filler`,
  features: `"features" — A polished capabilities or highlights grid:
   - Use wp:columns or a nested wp:group/card layout
   - Include a section heading, short intro, and 3-4 concrete feature blocks
   - Feature copy must reflect the theme vision or audience`,
  about: `"about" — A strong story / introduction section:
   - Use wp:media-text or an asymmetrical two-column layout
   - Include a meaningful heading and 2-3 body paragraphs
   - The tone should explain the brand, publication, or maker behind the site`,
  gallery: `"gallery" — A visual showcase section:
   - Use wp:gallery, wp:image, or a media-heavy wp:columns layout
   - Works especially well for portfolios, magazines, food, travel, and brand sites
   - Add a short heading/introduction so it feels designed, not dropped in`,
  team: `"team" — A people / credibility section:
   - Use wp:columns with repeated card-style groups
   - Each item should include a heading, short role line, and 1-2 sentences of context
   - Use for businesses, agencies, or brands that benefit from trust and personality`,
  pricing: `"pricing" — A conversion-oriented plans section:
   - Use wp:columns with 2-3 pricing cards built from wp:group, wp:heading, wp:list, wp:buttons
   - Make one option visually emphasized
   - Suitable for SaaS, services, memberships, or packaged offers`,
  testimonials: `"testimonials" — Social proof section:
   - Use wp:columns with 2-3 testimonial cards
   - Each card should contain quoted copy plus name/role attribution
   - Make the voices feel specific to the theme's audience or market`,
  faq: `"faq" — Objection handling / clarity section:
   - Use wp:details blocks or grouped Q&A pairs
   - Provide 3-5 concise, useful questions and answers
   - This should feel practical, not filler text`,
  'call-to-action': `"call-to-action" — A distinct conversion section:
   - Use wp:cover or a standout wp:group with strong color contrast
   - Include a headline, short persuasive copy, and a prominent button
   - This section should create a clear next step`,
};

export function buildPatternsPrompt(
  prompt: ThemePrompt,
  themeJson: ThemeJSON
): string {
  const textDomain = toThemeTextDomain(prompt.name);
  const colors = themeJson.settings?.color?.palette?.map(c => c.slug).join(', ') || 'primary, secondary, accent, base, contrast';
  const fonts = themeJson.settings?.typography?.fontFamilies?.map(f => f.slug).join(', ') || 'heading, body';
  const options = resolveGenerationOptions(prompt.generationOptions);
  const sectionPlan = options.sections.map((section, index) => `${index + 1}. ${SECTION_INSTRUCTIONS[section]}`).join('\n\n');

  return `You are designing patterns for a high-quality WordPress block theme. These patterns should feel polished, editorial, and WordPress-native — premium, but believable.

Theme: "${prompt.name}"
Vision: "${prompt.description}"
Text domain: "${textDomain}"
Homepage style: "${options.homepageStyle}"
Section density: "${options.mode}"

Available design tokens:
- Colors: ${colors} → use as var(--wp--preset--color--SLUG)
- Fonts: ${fonts} → use as var(--wp--preset--font-family--SLUG)
- Font sizes: small, medium, large, x-large, xx-large → use as var(--wp--preset--font-size--SLUG)
- Spacing: 30, 40, 50, 60, 70, 80 → use as var(--wp--preset--spacing--SLUG)

═══════════════════════════════════════
TEMPLATE PARTS (go in /parts/)
═══════════════════════════════════════

1. "header" — A premium site header:
   - Outer wp:group with a background color or subtle surface treatment
   - Inner wp:group with row layout {"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"} and constrained width
   - Left: wp:site-title styled with heading font, appropriate color for the background
   - Right: wp:navigation with 4-5 realistic links relevant to the theme description
   - Horizontal padding: var(--wp--preset--spacing--50), vertical: var(--wp--preset--spacing--40)
   - The header should have visual presence, but still feel like something a real WordPress theme would ship with
   - Apply textColor and backgroundColor attributes using palette slug names
   - Prefer clean navigation, clear spacing, and subtle brand character over excessive ornament

2. "footer" — A complete, styled footer:
   - Outer wp:group with a contrasting but coherent background
   - Inner content with constrained layout
   - 3-column wp:columns section: Column 1: site info (wp:site-title + wp:paragraph). Column 2: navigation links (wp:heading h4 + wp:navigation or wp:list). Column 3: brief description + social links paragraph
   - Below columns: wp:separator + wp:paragraph with copyright text, smaller font size, muted color
   - Generous padding: spacing--70 top and bottom
   - The footer should feel substantial and designed, but not noisy or overly dense

═══════════════════════════════════════
PATTERNS (go in /patterns/)
═══════════════════════════════════════

Generate EXACTLY these pattern slugs in this order:
${options.sections.map((section) => `- "${section}"`).join('\n')}

Section briefs:
${sectionPlan}

═══════════════════════════════════════
CRITICAL RULES
═══════════════════════════════════════

- NEVER use wp:html — this causes immediate rejection
- ALL blocks must be standard WordPress core blocks
- Use design tokens (var(--wp--preset--...)) for ALL colors, fonts, and sizes — never hardcoded values
- Set backgroundColor AND textColor attributes on wp:group and wp:cover blocks using palette SLUG NAMES (not CSS variables) for proper WordPress color resolution
- TEXT READABILITY IS MANDATORY: dark backgrounds → use "base" (white/light) textColor. Light backgrounds → use "contrast" (dark) textColor. NEVER leave textColor unset when backgroundColor is set — this creates unreadable text
- For inline styles, use the style attribute with CSS variables: {"style":{"color":{"text":"var(--wp--preset--color--base)"}}}
- Create RICH, NESTED block structures — not flat, shallow patterns
- Every pattern must have proper spacing: padding on containers, gap between children
- Placeholder text must be CONTEXTUALLY RELEVANT to "${prompt.description}" — never "Lorem ipsum"
- EVERY section should be visually distinct — vary backgrounds, spacing, and layout between patterns
- Maintain a believable WordPress aesthetic: clean layout rhythm, strong readability, tasteful card treatments, and realistic section transitions
- Do not overuse dark overlays, loud accents, gradients, or decorative treatments unless the brief clearly calls for them
- Sections should feel intentionally related to one another, sharing the same design system and not fighting visually
- Use realistic content lengths and button labels; avoid hypey filler like "Revolutionize your future today"
- The homepage style should influence the sections:
  - "landing" = conversion-focused, bold sections, clear CTAs
  - "editorial" = storytelling, richer copy, reading-oriented rhythm
  - "portfolio" = visual showcase, case-study feel, image-heavy sections
  - "business" = trust-building, services clarity, team/proof emphasis
- The section density should influence how elaborate the patterns are:
  - "minimal" = fewer nested elements, cleaner composition
  - "balanced" = premium but disciplined
  - "rich" = more varied layouts, deeper hierarchy, stronger visual moments
- Prefer composition quality over complexity. A simple section with good spacing and typography is better than a busy section with weak hierarchy
- Return one pattern per requested slug only; do not invent extra patterns
- Use safe slug names exactly as requested

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
${options.sections.map((section) => `    { "slug": "${section}", "title": "${section === 'call-to-action' ? 'Call to Action' : section.charAt(0).toUpperCase() + section.slice(1)}", "categories": ["featured"], "content": "<!-- wp:... -->" }`).join(',\n')}
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
