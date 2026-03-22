import JSZip from 'jszip';
import { ThemeOrchestrator } from '../src/ai/orchestrator';
import { packageThemeAsBuffer } from '../src/assembler';
import { sanitizeThemeName } from '../src/lib/sanitize';
import { AIProvider, ThemeJSON, Template, Pattern, ThemePrompt } from '../src/types';

// Full integration mock that produces a realistic theme
class IntegrationMockProvider implements AIProvider {
  async generateThemeJSON(): Promise<ThemeJSON> {
    return {
      version: 2,
      settings: {
        appearanceTools: true,
        color: {
          palette: [
            { slug: 'primary', color: '#1a365d', name: 'Primary' },
            { slug: 'secondary', color: '#2d3748', name: 'Secondary' },
            { slug: 'accent', color: '#ed8936', name: 'Accent' },
            { slug: 'background', color: '#ffffff', name: 'Background' },
            { slug: 'foreground', color: '#1a202c', name: 'Foreground' },
            { slug: 'muted', color: '#edf2f7', name: 'Muted' },
          ],
        },
        typography: {
          fontFamilies: [
            { fontFamily: 'system-ui, -apple-system, sans-serif', slug: 'body', name: 'Body' },
            { fontFamily: 'Georgia, Times, serif', slug: 'heading', name: 'Heading' },
          ],
          fontSizes: [
            { slug: 'small', size: '0.875rem', name: 'Small' },
            { slug: 'medium', size: '1rem', name: 'Medium' },
            { slug: 'large', size: '1.25rem', name: 'Large' },
            { slug: 'x-large', size: '1.5rem', name: 'Extra Large' },
            { slug: 'xx-large', size: '2.5rem', name: 'XX Large' },
          ],
        },
        spacing: { units: ['px', 'em', 'rem', 'vh', 'vw', '%'] },
        layout: { contentSize: '800px', wideSize: '1200px' },
        useRootPaddingAwareAlignments: true,
      },
      styles: {
        color: { background: 'var(--wp--preset--color--background)', text: 'var(--wp--preset--color--foreground)' },
        typography: { fontFamily: 'var(--wp--preset--font-family--body)', lineHeight: '1.6' },
        elements: {
          link: { color: { text: 'var(--wp--preset--color--primary)' } },
          heading: { typography: { fontFamily: 'var(--wp--preset--font-family--heading)' } },
        },
      },
      templateParts: [
        { name: 'header', title: 'Header', area: 'header' },
        { name: 'footer', title: 'Footer', area: 'footer' },
      ],
    };
  }

  async generatePatterns(): Promise<{ patterns: Pattern[]; parts: Template[] }> {
    return {
      patterns: [
        {
          slug: 'hero',
          title: 'Hero Section',
          categories: ['featured'],
          content: `<!-- wp:cover {"overlayColor":"primary","minHeight":500,"align":"full"} -->
<div class="wp-block-cover alignfull" style="min-height:500px"><span class="wp-block-cover__background has-primary-background-color has-background-dim-100 has-background-dim"></span><div class="wp-block-cover__inner-container">
<!-- wp:heading {"textAlign":"center","level":1} -->
<h1 class="has-text-align-center">Welcome to Our Site</h1>
<!-- /wp:heading -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Discover amazing content and stories.</p>
<!-- /wp:paragraph -->
<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Get Started</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div></div>
<!-- /wp:cover -->`,
        },
        {
          slug: 'call-to-action',
          title: 'Call to Action',
          categories: ['featured'],
          content: `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"4rem","bottom":"4rem"}}},"backgroundColor":"muted","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-muted-background-color has-background" style="padding-top:4rem;padding-bottom:4rem">
<!-- wp:heading {"textAlign":"center"} -->
<h2 class="has-text-align-center">Ready to Get Started?</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Join us today and start your journey.</p>
<!-- /wp:paragraph -->
<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Sign Up Now</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->`,
        },
      ],
      parts: [
        {
          slug: 'header',
          content: `<!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between"},"style":{"spacing":{"padding":{"top":"1rem","bottom":"1rem"}}}} -->
<div class="wp-block-group" style="padding-top:1rem;padding-bottom:1rem">
<!-- wp:site-title /-->
<!-- wp:navigation /-->
</div>
<!-- /wp:group -->`,
        },
        {
          slug: 'footer',
          content: `<!-- wp:group {"align":"full","backgroundColor":"secondary","style":{"spacing":{"padding":{"top":"2rem","bottom":"2rem"}}}} -->
<div class="wp-block-group alignfull has-secondary-background-color has-background" style="padding-top:2rem;padding-bottom:2rem">
<!-- wp:paragraph {"align":"center","textColor":"background"} -->
<p class="has-text-align-center has-background-color has-text-color">Copyright 2024. All rights reserved.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->`,
        },
      ],
    };
  }

  async correctThemeJSON(_errors: string[], _previousOutput: string): Promise<ThemeJSON> {
    return this.generateThemeJSON();
  }

  async correctPatterns(_errors: string[], _previousOutput: string): Promise<{ patterns: Pattern[]; parts: Template[] }> {
    return this.generatePatterns();
  }

  async correctTemplates(_errors: string[], _previousOutput: string): Promise<Template[]> {
    return this.generateTemplates();
  }

  async generateTemplates(): Promise<Template[]> {
    return [
      {
        slug: 'index',
        content: `<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:query -->
<div class="wp-block-query">
<!-- wp:post-template -->
<!-- wp:post-title {"isLink":true} /-->
<!-- wp:post-excerpt /-->
<!-- /wp:post-template -->
<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->
</div>
<!-- /wp:query -->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","area":"footer"} /-->`,
      },
      {
        slug: 'single',
        content: `<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:post-title /-->
<!-- wp:post-featured-image /-->
<!-- wp:post-content /-->
<!-- wp:post-terms {"term":"category"} /-->
<!-- wp:comments -->
<div class="wp-block-comments">
<!-- wp:comments-title /-->
<!-- wp:comment-template -->
<!-- wp:comment-author-name /-->
<!-- wp:comment-date /-->
<!-- wp:comment-content /-->
<!-- /wp:comment-template -->
</div>
<!-- /wp:comments -->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","area":"footer"} /-->`,
      },
      {
        slug: 'page',
        content: `<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:post-title /-->
<!-- wp:post-content /-->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","area":"footer"} /-->`,
      },
      {
        slug: '404',
        content: `<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:heading -->
<h2>Page Not Found</h2>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>The page you are looking for does not exist.</p>
<!-- /wp:paragraph -->
<!-- wp:search /-->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","area":"footer"} /-->`,
      },
      {
        slug: 'home',
        content: `<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:pattern {"slug":"integration-test-theme/hero"} /-->
<!-- wp:pattern {"slug":"integration-test-theme/call-to-action"} /-->
<!-- wp:template-part {"slug":"footer","area":"footer"} /-->`,
      },
      {
        slug: 'archive',
        content: `<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:query-title {"type":"archive"} /-->
<!-- wp:query -->
<div class="wp-block-query">
<!-- wp:post-template -->
<!-- wp:post-title {"isLink":true} /-->
<!-- wp:post-date /-->
<!-- wp:post-excerpt /-->
<!-- /wp:post-template -->
<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->
</div>
<!-- /wp:query -->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","area":"footer"} /-->`,
      },
    ];
  }
}

describe('Integration: Full Pipeline', () => {
  test('generates a complete valid theme zip', async () => {
    const prompt: ThemePrompt = {
      name: 'Integration Test Theme',
      description: 'A test theme for integration testing',
    };

    const provider = new IntegrationMockProvider();
    const orchestrator = new ThemeOrchestrator(provider);
    const theme = await orchestrator.generate(prompt);

    // Package into zip
    const themeSlug = sanitizeThemeName(prompt.name);
    const zipBuffer = await packageThemeAsBuffer(themeSlug, theme.files);

    // Verify zip structure
    const zip = await JSZip.loadAsync(zipBuffer);
    const files = Object.keys(zip.files);

    expect(files).toContain(`${themeSlug}/style.css`);
    expect(files).toContain(`${themeSlug}/theme.json`);
    expect(files).toContain(`${themeSlug}/functions.php`);
    expect(files).toContain(`${themeSlug}/readme.txt`);
    expect(files).toContain(`${themeSlug}/templates/index.html`);
    expect(files).toContain(`${themeSlug}/templates/single.html`);
    expect(files).toContain(`${themeSlug}/templates/page.html`);
    expect(files).toContain(`${themeSlug}/templates/404.html`);
    expect(files).toContain(`${themeSlug}/parts/header.html`);
    expect(files).toContain(`${themeSlug}/parts/footer.html`);
    expect(files).toContain(`${themeSlug}/patterns/hero.php`);

    // Verify NO wp:html anywhere
    for (const [path, file] of Object.entries(zip.files)) {
      if (!file.dir) {
        const content = await file.async('string');
        expect(content).not.toContain('wp:html');
      }
    }

    // Verify theme.json is valid JSON
    const themeJsonFile = zip.files[`${themeSlug}/theme.json`];
    const themeJsonContent = await themeJsonFile.async('string');
    const parsed = JSON.parse(themeJsonContent);
    expect(parsed.version).toBe(2);

    // Verify style.css has proper header
    const styleCssFile = zip.files[`${themeSlug}/style.css`];
    const styleCssContent = await styleCssFile.async('string');
    expect(styleCssContent).toContain('Theme Name:');
  });
});
