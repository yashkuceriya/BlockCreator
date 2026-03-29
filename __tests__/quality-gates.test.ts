import { validateThemeComposition, validateThemeDesignQuality } from '../src/validator';
import { Pattern, ThemeJSON } from '../src/types';

const validThemeJson: ThemeJSON = {
  version: 2,
  settings: {
    color: {
      palette: [
        { slug: 'primary', color: '#1d4ed8', name: 'Primary' },
        { slug: 'accent', color: '#f59e0b', name: 'Accent' },
        { slug: 'base', color: '#ffffff', name: 'Base' },
        { slug: 'contrast', color: '#111827', name: 'Contrast' },
        { slug: 'muted', color: '#6b7280', name: 'Muted' },
      ],
    },
    typography: {
      fontFamilies: [
        { slug: 'heading', name: 'Heading', fontFamily: 'Playfair Display, Georgia, serif' },
        { slug: 'body', name: 'Body', fontFamily: 'Inter, system-ui, sans-serif' },
      ],
    },
    layout: {
      contentSize: '760px',
      wideSize: '1200px',
    },
  },
  styles: {
    typography: {
      lineHeight: '1.7',
    },
  },
};

describe('Theme design quality validation', () => {
  test('accepts a readable, well-paired theme.json', () => {
    const result = validateThemeDesignQuality(validThemeJson);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('rejects poor base/contrast readability', () => {
    const result = validateThemeDesignQuality({
      ...validThemeJson,
      settings: {
        ...validThemeJson.settings,
        color: {
          palette: [
            { slug: 'primary', color: '#1d4ed8', name: 'Primary' },
            { slug: 'accent', color: '#f59e0b', name: 'Accent' },
            { slug: 'base', color: '#ffffff', name: 'Base' },
            { slug: 'contrast', color: '#d1d5db', name: 'Contrast' },
            { slug: 'muted', color: '#9ca3af', name: 'Muted' },
          ],
        },
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.includes('readability'))).toBe(true);
  });

  test('rejects identical heading and body font stacks', () => {
    const result = validateThemeDesignQuality({
      ...validThemeJson,
      settings: {
        ...validThemeJson.settings,
        typography: {
          fontFamilies: [
            { slug: 'heading', name: 'Heading', fontFamily: 'Inter, system-ui, sans-serif' },
            { slug: 'body', name: 'Body', fontFamily: 'Inter, system-ui, sans-serif' },
          ],
        },
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.includes('exact same stack'))).toBe(true);
  });

  test('rejects monospace body typography', () => {
    const result = validateThemeDesignQuality({
      ...validThemeJson,
      settings: {
        ...validThemeJson.settings,
        typography: {
          fontFamilies: [
            { slug: 'heading', name: 'Heading', fontFamily: 'Playfair Display, Georgia, serif' },
            { slug: 'body', name: 'Body', fontFamily: 'JetBrains Mono, monospace' },
          ],
        },
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.includes('monospace'))).toBe(true);
  });
});

describe('Theme composition validation', () => {
  const strongPatterns: Pattern[] = [
    {
      slug: 'hero',
      title: 'Hero',
      categories: ['featured'],
      content: '<!-- wp:cover {"overlayColor":"primary"} --><div class="wp-block-cover"><!-- wp:heading --><h1>Hero</h1><!-- /wp:heading --><!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Start</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:cover -->',
    },
    {
      slug: 'features',
      title: 'Features',
      categories: ['featured'],
      content: '<!-- wp:columns {"backgroundColor":"base"} --><div class="wp-block-columns"><!-- wp:column --><div class="wp-block-column"><!-- wp:heading --><h3>Fast</h3><!-- /wp:heading --></div><!-- /wp:column --></div><!-- /wp:columns -->',
    },
    {
      slug: 'faq',
      title: 'FAQ',
      categories: ['featured'],
      content: '<!-- wp:group {"backgroundColor":"muted"} --><div class="wp-block-group"><!-- wp:details --><details><summary>Question</summary><p>Answer</p></details><!-- /wp:details --></div><!-- /wp:group -->',
    },
  ];

  test('accepts a varied, purposeful homepage composition', () => {
    const result = validateThemeComposition(strongPatterns);
    expect(result.valid).toBe(true);
  });

  test('rejects a weak hero without CTA and no layout variety', () => {
    const result = validateThemeComposition(
      [
        {
          slug: 'hero',
          title: 'Hero',
          categories: ['featured'],
          content: '<!-- wp:group {"backgroundColor":"primary"} --><div class="wp-block-group"><!-- wp:heading --><h1>Hero</h1><!-- /wp:heading --></div><!-- /wp:group -->',
        },
        {
          slug: 'features',
          title: 'Features',
          categories: ['featured'],
          content: '<!-- wp:group {"backgroundColor":"primary"} --><div class="wp-block-group"><!-- wp:paragraph --><p>Feature text</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
        },
        {
          slug: 'testimonials',
          title: 'Testimonials',
          categories: ['featured'],
          content: '<!-- wp:group {"backgroundColor":"primary"} --><div class="wp-block-group"><!-- wp:paragraph --><p>Quote</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
        },
      ],
      []
    );

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.includes('layout variety'))).toBe(true);
    expect(result.errors.some((error) => error.includes('hero pattern should include a clear call-to-action'))).toBe(true);
  });
});
