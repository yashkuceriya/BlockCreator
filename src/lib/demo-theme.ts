/**
 * Pre-crafted demo theme for instant showcase without an API key.
 * This lets reviewers experience the full app immediately.
 */

import { ThemeFiles } from '../types';

export const DEMO_THEME_SLUG = 'aurora-studio';

export const DEMO_THEME_FILES: ThemeFiles = {
  'style.css': `/*
Theme Name: Aurora Studio
Theme URI:
Author: The Editorial Engine
Author URI:
Description: A bold, modern creative studio theme with deep navy backgrounds, warm gold accents, and elegant serif typography. Designed for agencies, portfolios, and creative professionals.
Version: 1.0.0
Requires at least: 6.2
Tested up to: 6.7
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: aurora-studio
*/`,

  'theme.json': JSON.stringify({
    "$schema": "https://schemas.wp.org/trunk/theme.json",
    "version": 2,
    "settings": {
      "appearanceTools": true,
      "useRootPaddingAwareAlignments": true,
      "color": {
        "palette": [
          { "slug": "primary", "color": "#1a2744", "name": "Primary" },
          { "slug": "secondary", "color": "#2d4a7a", "name": "Secondary" },
          { "slug": "accent", "color": "#d4a853", "name": "Accent" },
          { "slug": "base", "color": "#f8f6f1", "name": "Base" },
          { "slug": "contrast", "color": "#1a1a1a", "name": "Contrast" },
          { "slug": "muted", "color": "#8a8a8a", "name": "Muted" },
          { "slug": "surface", "color": "#ffffff", "name": "Surface" }
        ]
      },
      "typography": {
        "fontFamilies": [
          {
            "fontFamily": "'DM Serif Display', Georgia, 'Times New Roman', serif",
            "slug": "heading",
            "name": "DM Serif Display"
          },
          {
            "fontFamily": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            "slug": "body",
            "name": "Inter"
          }
        ],
        "fontSizes": [
          { "slug": "small", "size": "clamp(0.8rem, 0.77rem + 0.15vw, 0.9rem)", "name": "Small" },
          { "slug": "medium", "size": "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)", "name": "Medium" },
          { "slug": "large", "size": "clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)", "name": "Large" },
          { "slug": "x-large", "size": "clamp(1.75rem, 1.4rem + 1.75vw, 2.75rem)", "name": "Extra Large" },
          { "slug": "xx-large", "size": "clamp(2.5rem, 1.75rem + 3.75vw, 4.5rem)", "name": "Huge" }
        ]
      },
      "spacing": {
        "spacingScale": { "operator": "*", "increment": 1.5, "mediumStep": 1.5, "steps": 7, "unit": "rem" }
      },
      "layout": {
        "contentSize": "780px",
        "wideSize": "1200px"
      }
    },
    "styles": {
      "color": {
        "background": "var(--wp--preset--color--base)",
        "text": "var(--wp--preset--color--contrast)"
      },
      "typography": {
        "fontFamily": "var(--wp--preset--font-family--body)",
        "fontSize": "var(--wp--preset--font-size--medium)",
        "lineHeight": "1.7"
      },
      "spacing": {
        "padding": {
          "top": "0",
          "right": "var(--wp--preset--spacing--50)",
          "bottom": "0",
          "left": "var(--wp--preset--spacing--50)"
        }
      },
      "elements": {
        "link": { "color": { "text": "var(--wp--preset--color--accent)" } },
        "heading": {
          "typography": {
            "fontFamily": "var(--wp--preset--font-family--heading)",
            "lineHeight": "1.2",
            "fontWeight": "700"
          },
          "color": { "text": "var(--wp--preset--color--contrast)" }
        },
        "button": {
          "color": {
            "background": "var(--wp--preset--color--accent)",
            "text": "var(--wp--preset--color--primary)"
          },
          "border": { "radius": "4px" },
          "typography": { "fontWeight": "600" }
        }
      }
    },
    "templateParts": [
      { "name": "header", "area": "header" },
      { "name": "footer", "area": "footer" }
    ]
  }, null, 2),

  'functions.php': `<?php
/**
 * Aurora Studio theme functions.
 *
 * @package aurora-studio
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function aurora_studio_editor_styles() {
    add_editor_style( 'style.css' );
}
add_action( 'after_setup_theme', 'aurora_studio_editor_styles' );

function aurora_studio_register_pattern_categories() {
    register_block_pattern_category( 'featured', array(
        'label' => __( 'Featured', 'aurora-studio' ),
    ) );
}
add_action( 'init', 'aurora_studio_register_pattern_categories' );
`,

  'readme.txt': `=== Aurora Studio ===
Requires at least: 6.2
Tested up to: 6.7
Requires PHP: 7.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

== Description ==
A bold, modern creative studio theme with deep navy backgrounds, warm gold accents, and elegant serif typography.

== Changelog ==
= 1.0.0 =
* Initial release
`,

  templates: {
    'index.html': `<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)","bottom":"var(--wp--preset--spacing--70)"}}}} -->
<main class="wp-block-group">
<!-- wp:query-title {"type":"archive","fontSize":"x-large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"}}} /-->
<!-- wp:query {"queryId":1,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date"}} -->
<!-- wp:post-template -->
<!-- wp:post-featured-image {"isLink":true,"style":{"border":{"radius":"8px"}}} /-->
<!-- wp:post-title {"isLink":true,"fontSize":"large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"},"spacing":{"margin":{"top":"var(--wp--preset--spacing--30)"}}}} /-->
<!-- wp:post-excerpt {"fontSize":"medium","style":{"color":{"text":"var(--wp--preset--color--muted)"}}} /-->
<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"},"style":{"spacing":{"blockGap":"var(--wp--preset--spacing--30)"}}} -->
<div class="wp-block-group">
<!-- wp:post-date {"fontSize":"small","style":{"color":{"text":"var(--wp--preset--color--muted)"}}} /-->
<!-- wp:post-author-name {"fontSize":"small","style":{"color":{"text":"var(--wp--preset--color--muted)"}}} /-->
</div>
<!-- /wp:group -->
<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- /wp:post-template -->
<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->
<!-- /wp:query -->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","area":"footer"} /-->`,

    'home.html': `<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:pattern {"slug":"aurora-studio/hero"} /-->
<!-- wp:pattern {"slug":"aurora-studio/features"} /-->
<!-- wp:pattern {"slug":"aurora-studio/about"} /-->
<!-- wp:pattern {"slug":"aurora-studio/call-to-action"} /-->
<!-- wp:pattern {"slug":"aurora-studio/testimonials"} /-->
<!-- wp:template-part {"slug":"footer","area":"footer"} /-->`,

    'single.html': `<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)","bottom":"var(--wp--preset--spacing--70)"}}}} -->
<main class="wp-block-group">
<!-- wp:post-featured-image {"style":{"border":{"radius":"8px"}}} /-->
<!-- wp:post-title {"level":1,"fontSize":"xx-large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"},"spacing":{"margin":{"top":"var(--wp--preset--spacing--50)"}}}} /-->
<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"},"style":{"spacing":{"blockGap":"var(--wp--preset--spacing--30)"},"typography":{"fontSize":"var(--wp--preset--font-size--small)"},"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<div class="wp-block-group">
<!-- wp:post-date /-->
<!-- wp:paragraph -->
<p>&middot;</p>
<!-- /wp:paragraph -->
<!-- wp:post-author-name /-->
<!-- wp:paragraph -->
<p>&middot;</p>
<!-- /wp:paragraph -->
<!-- wp:post-terms {"term":"category"} /-->
</div>
<!-- /wp:group -->
<!-- wp:spacer {"height":"24px"} -->
<div style="height:24px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:post-content {"layout":{"type":"constrained"}} /-->
<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:separator {"className":"is-style-wide"} -->
<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide"/>
<!-- /wp:separator -->
<!-- wp:post-terms {"term":"post_tag"} /-->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","area":"footer"} /-->`,

    'page.html': `<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)","bottom":"var(--wp--preset--spacing--70)"}}}} -->
<main class="wp-block-group">
<!-- wp:post-title {"level":1,"fontSize":"x-large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"}}} /-->
<!-- wp:post-content {"layout":{"type":"constrained"}} /-->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","area":"footer"} /-->`,

    'archive.html': `<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)","bottom":"var(--wp--preset--spacing--70)"}}}} -->
<main class="wp-block-group">
<!-- wp:query-title {"type":"archive","fontSize":"x-large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"}}} /-->
<!-- wp:term-description {"style":{"color":{"text":"var(--wp--preset--color--muted)"},"typography":{"fontStyle":"italic"}}} /-->
<!-- wp:query {"queryId":2,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date"}} -->
<!-- wp:post-template -->
<!-- wp:post-featured-image {"isLink":true,"style":{"border":{"radius":"8px"}}} /-->
<!-- wp:post-title {"isLink":true,"fontSize":"large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"}}} /-->
<!-- wp:post-excerpt /-->
<!-- wp:post-date {"fontSize":"small","style":{"color":{"text":"var(--wp--preset--color--muted)"}}} /-->
<!-- wp:spacer {"height":"32px"} -->
<div style="height:32px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- /wp:post-template -->
<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->
<!-- /wp:query -->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","area":"footer"} /-->`,

    '404.html': `<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--80)","bottom":"var(--wp--preset--spacing--80)"}}}} -->
<main class="wp-block-group">
<!-- wp:group {"layout":{"type":"constrained","contentSize":"480px"},"style":{"spacing":{"blockGap":"var(--wp--preset--spacing--40)"}}} -->
<div class="wp-block-group" style="text-align:center">
<!-- wp:heading {"level":1,"fontSize":"xx-large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"}}} -->
<h1 class="wp-block-heading">Page Not Found</h1>
<!-- /wp:heading -->
<!-- wp:paragraph {"fontSize":"medium","style":{"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p>The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved. Try searching or head back home.</p>
<!-- /wp:paragraph -->
<!-- wp:search {"label":"Search","buttonText":"Search","buttonPosition":"button-inside","buttonUseIcon":true} /-->
<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/">Return Home</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","area":"footer"} /-->`,
  },

  parts: {
    'header.html': `<!-- wp:group {"backgroundColor":"primary","textColor":"base","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--40)","bottom":"var(--wp--preset--spacing--40)"}}}} -->
<div class="wp-block-group has-primary-background-color has-base-color has-text-color has-background">
<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group">
<!-- wp:site-title {"style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)","fontSize":"var(--wp--preset--font-size--large)","fontWeight":"700"},"elements":{"link":{"color":{"text":"var(--wp--preset--color--base)"}}}}} /-->
<!-- wp:navigation {"textColor":"base","fontSize":"small","layout":{"type":"flex","justifyContent":"right"}} -->
<!-- wp:navigation-link {"label":"Home","url":"/","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"About","url":"/about","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Work","url":"/work","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Journal","url":"/blog","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Contact","url":"/contact","kind":"custom","isTopLevelLink":true} /-->
<!-- /wp:navigation -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->`,

    'footer.html': `<!-- wp:group {"backgroundColor":"primary","textColor":"base","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)","bottom":"var(--wp--preset--spacing--70)"}}}} -->
<div class="wp-block-group has-primary-background-color has-base-color has-text-color has-background">
<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"var(--wp--preset--spacing--60)"}}}} -->
<div class="wp-block-columns">
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:site-title {"style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)","fontSize":"var(--wp--preset--font-size--large)"},"elements":{"link":{"color":{"text":"var(--wp--preset--color--base)"}}}}} /-->
<!-- wp:paragraph {"fontSize":"small","style":{"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p>Crafting bold digital experiences for forward-thinking brands since 2020.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:heading {"level":4,"fontSize":"small","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.1em"},"color":{"text":"var(--wp--preset--color--accent)"}}} -->
<h4 class="wp-block-heading">Quick Links</h4>
<!-- /wp:heading -->
<!-- wp:navigation {"textColor":"base","fontSize":"small","layout":{"type":"flex","orientation":"vertical"}} -->
<!-- wp:navigation-link {"label":"Home","url":"/","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"About","url":"/about","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Work","url":"/work","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Contact","url":"/contact","kind":"custom","isTopLevelLink":true} /-->
<!-- /wp:navigation -->
</div>
<!-- /wp:column -->
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:heading {"level":4,"fontSize":"small","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.1em"},"color":{"text":"var(--wp--preset--color--accent)"}}} -->
<h4 class="wp-block-heading">Stay Connected</h4>
<!-- /wp:heading -->
<!-- wp:paragraph {"fontSize":"small","style":{"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p>Follow our journey and get inspired by our latest projects and creative insights.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
<!-- wp:separator {"style":{"color":{"background":"rgba(255,255,255,0.1)"}},"className":"is-style-wide"} -->
<hr class="wp-block-separator has-text-color has-alpha-channel-opacity has-background is-style-wide"/>
<!-- /wp:separator -->
<!-- wp:paragraph {"align":"center","fontSize":"small","style":{"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p class="has-text-align-center">&copy; 2025 Aurora Studio. All rights reserved.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->`,
  },

  patterns: {
    'hero.php': `<?php
/**
 * Title: Hero
 * Slug: aurora-studio/hero
 * Categories: featured
 */
?>
<!-- wp:cover {"overlayColor":"primary","minHeight":620,"minHeightUnit":"px","isDark":true,"align":"full","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--80)","bottom":"var(--wp--preset--spacing--80)","left":"var(--wp--preset--spacing--50)","right":"var(--wp--preset--spacing--50)"}}}} -->
<div class="wp-block-cover alignfull is-dark" style="min-height:620px;padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">
<span aria-hidden="true" class="wp-block-cover__background has-primary-background-color has-background-dim-100 has-background-dim"></span>
<div class="wp-block-cover__inner-container">
<!-- wp:group {"layout":{"type":"constrained","contentSize":"680px"}} -->
<div class="wp-block-group" style="text-align:center">
<!-- wp:heading {"level":1,"textColor":"base","fontSize":"xx-large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)","lineHeight":"1.1"}}} -->
<h1 class="wp-block-heading has-base-color has-text-color">We Design Brands That Demand Attention</h1>
<!-- /wp:heading -->
<!-- wp:paragraph {"textColor":"muted","fontSize":"large","style":{"spacing":{"margin":{"top":"var(--wp--preset--spacing--40)"}}}} -->
<p class="has-muted-color has-text-color">Strategic creative direction, brand identity, and digital experiences for companies that refuse to blend in.</p>
<!-- /wp:paragraph -->
<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var(--wp--preset--spacing--50)"}}}} -->
<div class="wp-block-buttons">
<!-- wp:button {"backgroundColor":"accent","textColor":"primary","style":{"border":{"radius":"4px"},"spacing":{"padding":{"top":"16px","bottom":"16px","left":"32px","right":"32px"}}}} -->
<div class="wp-block-button"><a class="wp-block-button__link has-primary-color has-accent-background-color has-text-color has-background wp-element-button" style="border-radius:4px;padding-top:16px;padding-right:32px;padding-bottom:16px;padding-left:32px">View Our Work</a></div>
<!-- /wp:button -->
<!-- wp:button {"className":"is-style-outline","style":{"border":{"radius":"4px"},"spacing":{"padding":{"top":"16px","bottom":"16px","left":"32px","right":"32px"}},"elements":{"link":{"color":{"text":"var(--wp--preset--color--base)"}}},"color":{"text":"var(--wp--preset--color--base)"}}} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-base-color has-text-color wp-element-button" style="border-radius:4px;padding-top:16px;padding-right:32px;padding-bottom:16px;padding-left:32px">Get in Touch</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</div>
</div>
<!-- /wp:cover -->`,

    'features.php': `<?php
/**
 * Title: Features
 * Slug: aurora-studio/features
 * Categories: featured
 */
?>
<!-- wp:group {"align":"full","backgroundColor":"base","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)","bottom":"var(--wp--preset--spacing--70)"}}}} -->
<div class="wp-block-group alignfull has-base-background-color has-background">
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
<!-- wp:heading {"textAlign":"center","fontSize":"x-large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"},"spacing":{"margin":{"bottom":"var(--wp--preset--spacing--30)"}}}} -->
<h2 class="wp-block-heading has-text-align-center">What We Do Best</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"align":"center","fontSize":"medium","style":{"color":{"text":"var(--wp--preset--color--muted)"},"spacing":{"margin":{"bottom":"var(--wp--preset--spacing--60)"}}}} -->
<p class="has-text-align-center has-muted-color has-text-color">Three decades of combined experience distilled into services that move the needle.</p>
<!-- /wp:paragraph -->
<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"var(--wp--preset--spacing--50)"}}}} -->
<div class="wp-block-columns">
<!-- wp:column {"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--50)","right":"var(--wp--preset--spacing--50)","bottom":"var(--wp--preset--spacing--50)","left":"var(--wp--preset--spacing--50)"}},"border":{"radius":"8px"}},"backgroundColor":"surface"} -->
<div class="wp-block-column has-surface-background-color has-background" style="border-radius:8px">
<!-- wp:heading {"level":3,"fontSize":"large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"}}} -->
<h3 class="wp-block-heading">Brand Strategy</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p>We define your brand's positioning, voice, and visual identity to create a foundation that resonates with your audience and stands the test of time.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
<!-- wp:column {"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--50)","right":"var(--wp--preset--spacing--50)","bottom":"var(--wp--preset--spacing--50)","left":"var(--wp--preset--spacing--50)"}},"border":{"radius":"8px"}},"backgroundColor":"surface"} -->
<div class="wp-block-column has-surface-background-color has-background" style="border-radius:8px">
<!-- wp:heading {"level":3,"fontSize":"large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"}}} -->
<h3 class="wp-block-heading">Digital Design</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p>From responsive websites to mobile apps, we craft pixel-perfect interfaces that delight users and drive conversions at every touchpoint.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
<!-- wp:column {"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--50)","right":"var(--wp--preset--spacing--50)","bottom":"var(--wp--preset--spacing--50)","left":"var(--wp--preset--spacing--50)"}},"border":{"radius":"8px"}},"backgroundColor":"surface"} -->
<div class="wp-block-column has-surface-background-color has-background" style="border-radius:8px">
<!-- wp:heading {"level":3,"fontSize":"large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"}}} -->
<h3 class="wp-block-heading">Creative Direction</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p>We guide the visual narrative across campaigns, ensuring every piece of content reinforces your brand story and captivates your target audience.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->`,

    'call-to-action.php': `<?php
/**
 * Title: Call to Action
 * Slug: aurora-studio/call-to-action
 * Categories: featured
 */
?>
<!-- wp:cover {"overlayColor":"accent","minHeight":400,"minHeightUnit":"px","isDark":false,"align":"full","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)","bottom":"var(--wp--preset--spacing--70)"}}}} -->
<div class="wp-block-cover alignfull" style="min-height:400px;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)">
<span aria-hidden="true" class="wp-block-cover__background has-accent-background-color has-background-dim-100 has-background-dim"></span>
<div class="wp-block-cover__inner-container">
<!-- wp:group {"layout":{"type":"constrained","contentSize":"600px"}} -->
<div class="wp-block-group" style="text-align:center">
<!-- wp:heading {"textColor":"primary","fontSize":"x-large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"}}} -->
<h2 class="wp-block-heading has-primary-color has-text-color">Ready to Transform Your Brand?</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"textColor":"primary","fontSize":"medium","style":{"spacing":{"margin":{"top":"var(--wp--preset--spacing--30)"}}}} -->
<p class="has-primary-color has-text-color">Let's discuss how we can elevate your digital presence and create something extraordinary together.</p>
<!-- /wp:paragraph -->
<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var(--wp--preset--spacing--50)"}}}} -->
<div class="wp-block-buttons">
<!-- wp:button {"backgroundColor":"primary","textColor":"base","style":{"border":{"radius":"4px"},"spacing":{"padding":{"top":"16px","bottom":"16px","left":"40px","right":"40px"}}}} -->
<div class="wp-block-button"><a class="wp-block-button__link has-base-color has-primary-background-color has-text-color has-background wp-element-button" style="border-radius:4px;padding-top:16px;padding-right:40px;padding-bottom:16px;padding-left:40px">Start a Project</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</div>
</div>
<!-- /wp:cover -->`,

    'about.php': `<?php
/**
 * Title: About
 * Slug: aurora-studio/about
 * Categories: featured
 */
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)","bottom":"var(--wp--preset--spacing--70)"}}}} -->
<div class="wp-block-group alignfull">
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
<!-- wp:media-text {"mediaPosition":"right","mediaType":"image","verticalAlignment":"center"} -->
<div class="wp-block-media-text has-media-on-the-right is-vertically-aligned-center">
<div class="wp-block-media-text__content">
<!-- wp:heading {"fontSize":"x-large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"}}} -->
<h2 class="wp-block-heading">We Believe in the Power of Bold Ideas</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"fontSize":"medium","style":{"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p>Aurora Studio was founded on a simple premise: great design isn't decoration — it's communication. Every color choice, every typeface, every pixel serves a purpose.</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"style":{"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p>Our team of strategists, designers, and developers work in concert to create digital experiences that don't just look beautiful — they perform. We measure our success by your growth.</p>
<!-- /wp:paragraph -->
</div>
<figure class="wp-block-media-text__media">
<!-- wp:image {"sizeSlug":"full"} -->
<figure class="wp-block-image size-full"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' fill='%231a2744'%3E%3Crect width='600' height='400' rx='8'/%3E%3Ctext x='300' y='200' text-anchor='middle' fill='%23d4a853' font-size='20' font-family='Georgia,serif'%3EAurora Studio%3C/text%3E%3C/svg%3E" alt="Aurora Studio team at work"/></figure>
<!-- /wp:image -->
</figure>
</div>
<!-- /wp:media-text -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->`,

    'testimonials.php': `<?php
/**
 * Title: Testimonials
 * Slug: aurora-studio/testimonials
 * Categories: featured
 */
?>
<!-- wp:group {"align":"full","backgroundColor":"primary","textColor":"base","style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--70)","bottom":"var(--wp--preset--spacing--70)"}}}} -->
<div class="wp-block-group alignfull has-base-color has-primary-background-color has-text-color has-background">
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
<!-- wp:heading {"textAlign":"center","textColor":"base","fontSize":"x-large","style":{"typography":{"fontFamily":"var(--wp--preset--font-family--heading)"},"spacing":{"margin":{"bottom":"var(--wp--preset--spacing--60)"}}}} -->
<h2 class="wp-block-heading has-text-align-center has-base-color has-text-color">What Our Clients Say</h2>
<!-- /wp:heading -->
<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"var(--wp--preset--spacing--50)"}}}} -->
<div class="wp-block-columns">
<!-- wp:column {"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--50)","right":"var(--wp--preset--spacing--50)","bottom":"var(--wp--preset--spacing--50)","left":"var(--wp--preset--spacing--50)"}},"border":{"radius":"8px","width":"1px","color":"rgba(255,255,255,0.1)"}}} -->
<div class="wp-block-column" style="border-radius:8px;border-width:1px;border-color:rgba(255,255,255,0.1)">
<!-- wp:paragraph {"style":{"typography":{"fontStyle":"italic","fontSize":"var(--wp--preset--font-size--medium)"},"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p>&ldquo;Aurora Studio transformed our entire brand identity. The website they delivered exceeded every expectation and directly contributed to a 40% increase in qualified leads.&rdquo;</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"style":{"typography":{"fontWeight":"700","fontSize":"var(--wp--preset--font-size--small)"},"color":{"text":"var(--wp--preset--color--accent)"},"spacing":{"margin":{"top":"var(--wp--preset--spacing--40)"}}}} -->
<p>Sarah Chen, CEO at Meridian Labs</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
<!-- wp:column {"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--50)","right":"var(--wp--preset--spacing--50)","bottom":"var(--wp--preset--spacing--50)","left":"var(--wp--preset--spacing--50)"}},"border":{"radius":"8px","width":"1px","color":"rgba(255,255,255,0.1)"}}} -->
<div class="wp-block-column" style="border-radius:8px;border-width:1px;border-color:rgba(255,255,255,0.1)">
<!-- wp:paragraph {"style":{"typography":{"fontStyle":"italic","fontSize":"var(--wp--preset--font-size--medium)"},"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p>&ldquo;Working with this team was a masterclass in creative excellence. They didn't just design a website — they crafted a digital experience that perfectly captures who we are.&rdquo;</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"style":{"typography":{"fontWeight":"700","fontSize":"var(--wp--preset--font-size--small)"},"color":{"text":"var(--wp--preset--color--accent)"},"spacing":{"margin":{"top":"var(--wp--preset--spacing--40)"}}}} -->
<p>Marcus Rivera, Founder of Nomad Collective</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
<!-- wp:column {"style":{"spacing":{"padding":{"top":"var(--wp--preset--spacing--50)","right":"var(--wp--preset--spacing--50)","bottom":"var(--wp--preset--spacing--50)","left":"var(--wp--preset--spacing--50)"}},"border":{"radius":"8px","width":"1px","color":"rgba(255,255,255,0.1)"}}} -->
<div class="wp-block-column" style="border-radius:8px;border-width:1px;border-color:rgba(255,255,255,0.1)">
<!-- wp:paragraph {"style":{"typography":{"fontStyle":"italic","fontSize":"var(--wp--preset--font-size--medium)"},"color":{"text":"var(--wp--preset--color--muted)"}}} -->
<p>&ldquo;The attention to detail is remarkable. Every interaction, every transition, every pixel — it all feels intentional. Our users constantly compliment the experience.&rdquo;</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph {"style":{"typography":{"fontWeight":"700","fontSize":"var(--wp--preset--font-size--small)"},"color":{"text":"var(--wp--preset--color--accent)"},"spacing":{"margin":{"top":"var(--wp--preset--spacing--40)"}}}} -->
<p>Priya Sharma, VP Design at Wavelength</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->`,
  },
};
