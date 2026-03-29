import { ThemeJSON, ThemePrompt } from '../../types';

export function buildTemplatesPrompt(
  prompt: ThemePrompt,
  themeJson: ThemeJSON,
  patternSlugs: string[],
  partSlugs: string[]
): string {
  const textDomain = prompt.name.toLowerCase().replace(/\s+/g, '-');
  return `Generate WordPress block templates for "${prompt.name}" (text domain: "${textDomain}").
Vision: "${prompt.description}"

Available template parts: ${partSlugs.map(s => `"${s}"`).join(', ')}
Available patterns: ${patternSlugs.map(s => `"${textDomain}/${s}"`).join(', ')}

Generate these 6 templates:

1. "index" — Blog listing (the default template):
   - <!-- wp:template-part {"slug":"header","area":"header"} /-->
   - wp:group with {"tagName":"main","layout":{"type":"constrained"}} wrapping:
     - wp:query-title (h1, heading font, x-large)
     - wp:query with {"queryId":1,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date"}} containing:
       - wp:post-template wrapping each post:
         - wp:post-featured-image (linked, with border-radius)
         - wp:post-title (h2, linked, heading font)
         - wp:post-excerpt (body font, muted color)
         - wp:group with row layout: wp:post-date + wp:post-author-name (both small, muted)
         - wp:spacer between posts
       - wp:query-pagination (with previous, page numbers, next)
     - Add vertical padding to the main group
   - <!-- wp:template-part {"slug":"footer","area":"footer"} /-->

2. "home" — Front page (THE SHOWCASE — must be visually stunning):
   - <!-- wp:template-part {"slug":"header","area":"header"} /-->
   - Reference ALL patterns in this order:
${patternSlugs.map(s => `     - <!-- wp:pattern {"slug":"${textDomain}/${s}"} /-->`).join('\n')}
   - <!-- wp:template-part {"slug":"footer","area":"footer"} /-->
   - This is the homepage. Every pattern must be included. The visual flow should feel intentional.

3. "single" — Single post (optimized for reading):
   - <!-- wp:template-part {"slug":"header","area":"header"} /-->
   - wp:group with {"tagName":"main","layout":{"type":"constrained"}} wrapping:
     - wp:post-featured-image (wide alignment if possible, border-radius)
     - wp:post-title (h1, xx-large or x-large, heading font — this should feel EDITORIAL)
     - wp:group with row layout and small/muted styling:
       - wp:post-date
       - wp:paragraph with "·" separator
       - wp:post-author-name
       - wp:paragraph with "·" separator
       - wp:post-terms {"term":"category"}
     - wp:spacer (small, ~24px)
     - wp:post-content {"layout":{"type":"constrained"}}
     - wp:spacer
     - wp:separator
     - wp:post-terms {"term":"post_tag"} (styled as tags)
     - wp:spacer
     - wp:comments wrapping:
       - wp:comments-title
       - wp:comment-template containing:
         - wp:columns (avatar + content):
           - wp:column (narrow): wp:avatar
           - wp:column: wp:comment-author-name + wp:comment-date + wp:comment-content + wp:comment-reply-link
       - wp:comments-pagination
     - wp:post-comments-form
   - <!-- wp:template-part {"slug":"footer","area":"footer"} /-->

4. "page" — Static page (clean and focused):
   - <!-- wp:template-part {"slug":"header","area":"header"} /-->
   - wp:group with {"tagName":"main","layout":{"type":"constrained"}} and vertical padding:
     - wp:post-title (h1, x-large, heading font)
     - wp:post-content {"layout":{"type":"constrained"}}
   - <!-- wp:template-part {"slug":"footer","area":"footer"} /-->

5. "archive" — Archive/category listing:
   - <!-- wp:template-part {"slug":"header","area":"header"} /-->
   - wp:group with {"tagName":"main","layout":{"type":"constrained"}} and padding:
     - wp:query-title (h1, heading font)
     - wp:term-description (muted color, italic)
     - wp:query with post-template showing: wp:post-featured-image, wp:post-title (h2, linked), wp:post-excerpt, wp:group row of wp:post-date + wp:post-author-name
     - wp:query-pagination
   - <!-- wp:template-part {"slug":"footer","area":"footer"} /-->

6. "404" — Not found (should feel designed, not forgotten):
   - <!-- wp:template-part {"slug":"header","area":"header"} /-->
   - wp:group with {"tagName":"main","layout":{"type":"constrained"}} and GENEROUS padding (spacing--80):
     - Center-aligned content
     - wp:heading "Page Not Found" (h1, xx-large, heading font)
     - wp:paragraph with a friendly message (medium font, muted color)
     - wp:search with a styled search button
     - wp:buttons with a "Return Home" link button
   - <!-- wp:template-part {"slug":"footer","area":"footer"} /-->

CRITICAL RULES:
- Template part syntax: <!-- wp:template-part {"slug":"header","area":"header"} /-->
- Pattern syntax: <!-- wp:pattern {"slug":"${textDomain}/hero"} /-->
- NEVER use wp:html
- Wrap main content in wp:group with tagName:"main" and constrained layout
- Use theme.json presets for ALL colors and fonts via var(--wp--preset--...)
- The "home" template MUST include ALL generated patterns — it's the showcase
- Add proper spacing to all containers

REFERENCE — correct template part and pattern reference syntax:
<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:pattern {"slug":"${textDomain}/hero"} /-->
<!-- wp:template-part {"slug":"footer","area":"footer"} /-->

REFERENCE — correct query loop structure:
<!-- wp:query {"queryId":1,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date"}} -->
<!-- wp:post-template -->
<!-- wp:post-featured-image {"isLink":true,"style":{"border":{"radius":"8px"}}} /-->
<!-- wp:post-title {"isLink":true,"fontSize":"large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"}}} /-->
<!-- wp:post-excerpt {"fontSize":"medium"} /-->
<!-- /wp:post-template -->
<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->
<!-- /wp:query -->

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
  return `Your previous templates had validation errors:
${errors.map((e) => `- ${e}`).join('\n')}

Fix the errors. NEVER use wp:html. Ensure all blocks are properly nested and closed.
Keep template structure and design quality intact — don't simplify to fix errors.

Previous output:
${previousOutput}

Respond with ONLY the corrected JSON.`;
}
