# What I'd Do Next

## With Another Week

**1. Theme iteration and refinement**
Let users adjust their description and re-generate without starting from scratch. Keep the previous theme.json as context so the AI can make targeted changes rather than generating from zero. This is the biggest UX gap — right now each generation is independent.

**2. Accessibility validation in the pipeline**
Add a post-generation check that scans templates for heading hierarchy (no skipping h1 to h3), landmark regions, alt text placeholders, and color contrast estimates based on theme.json palette values. Flag issues before download.

**3. Smarter pattern generation**
Instead of always generating 5 fixed patterns, analyze the description to decide what patterns make sense. A photography portfolio needs a gallery grid, not a testimonials section. A restaurant site needs a menu pattern, not a generic features block.

**4. Better font handling**
Currently themes reference system font stacks. Add Google Fonts integration — include `@font-face` declarations in theme.json's font families and generate the `webfonts` directory with actual WOFF2 files or CDN references.

## To Make This Production-Ready

**Formal block validation pipeline**
Replace the regex-based block parser with a proper AST parser. The current approach works for well-formed output but could miss edge cases in deeply nested or malformed markup. A tree-based parser would also enable structural analysis (e.g., "this template has no main content area").

**Output quality scoring**
Before delivering the theme, run automated checks:
- Does every template reference the header and footer parts?
- Does theme.json define all colors referenced in patterns?
- Are all pattern slugs referenced in templates actually generated?
- Is the homepage meaningfully different from the index template?

**Rate limiting and cost controls**
Each generation makes 3+ AI calls. In production: per-user rate limits, token usage tracking, cost alerting, and a queue system for high-traffic periods.

**Multi-provider failover**
If Anthropic is down or rate-limited, automatically fall back to OpenAI or a local model. The `AIProvider` interface already supports this — just need the OpenAI implementation and a failover wrapper.

**E2E testing with real WordPress**
Run the generated ZIP through an actual WordPress installation in CI (via WP Playground or Docker) and verify: theme activates without errors, all templates render, no PHP warnings, Core Web Vitals pass on the generated pages.

## Scaling to Complex Dynamic Features

**Custom Block Patterns with client-side interactivity**
WordPress Interactivity API (wp-interactivity) enables client-side behavior without Custom HTML. The generator could produce patterns that use data-wp-interactive attributes for accordions, tabs, and lightboxes.

**WooCommerce theme support**
Extend the template set to include WooCommerce templates (product archive, single product, cart, checkout). This requires understanding WooCommerce block markup conventions and generating compatible patterns.

**Multi-page generation with consistent design language**
Instead of one-shot generation, build a "design system first" approach: generate the token system, then generate pages one at a time with full awareness of what already exists. This would produce more cohesive themes.

**Plugin-aware generation**
Accept a list of target plugins (WooCommerce, Jetpack, WPML) and generate templates/patterns that are compatible with their block extensions. This moves the tool from "theme generator" to "WordPress site generator."
