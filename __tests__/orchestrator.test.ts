import { ThemeOrchestrator, ProgressCallback } from '../src/ai/orchestrator';
import { AIProvider, ThemeJSON, Template, Pattern, ThemePrompt, GenerationProgress } from '../src/types';

const mockThemeJson: ThemeJSON = {
  version: 2,
  settings: {
    appearanceTools: true,
    color: {
      palette: [
        { slug: 'primary', color: '#0066cc', name: 'Primary' },
        { slug: 'secondary', color: '#333333', name: 'Secondary' },
        { slug: 'accent', color: '#ff6600', name: 'Accent' },
        { slug: 'base', color: '#ffffff', name: 'Base' },
        { slug: 'contrast', color: '#111827', name: 'Contrast' },
        { slug: 'muted', color: '#f5f5f5', name: 'Muted' },
      ],
    },
    typography: {
      fontFamilies: [
        { fontFamily: 'system-ui, sans-serif', slug: 'body', name: 'Body' },
        { fontFamily: 'Georgia, serif', slug: 'heading', name: 'Heading' },
      ],
      fontSizes: [
        { slug: 'small', size: '0.875rem', name: 'Small' },
        { slug: 'medium', size: '1rem', name: 'Medium' },
        { slug: 'large', size: '1.25rem', name: 'Large' },
        { slug: 'x-large', size: '1.5rem', name: 'Extra Large' },
        { slug: 'xx-large', size: '2rem', name: 'XX Large' },
      ],
    },
    layout: { contentSize: '800px', wideSize: '1200px' },
    useRootPaddingAwareAlignments: true,
  },
  styles: {
    color: { background: '#ffffff', text: '#111827' },
    typography: { lineHeight: '1.6' },
  },
  templateParts: [
    { name: 'header', title: 'Header', area: 'header' },
    { name: 'footer', title: 'Footer', area: 'footer' },
  ],
};

const mockPatterns: Pattern[] = [
  {
    slug: 'hero',
    title: 'Hero',
    categories: ['featured'],
    content: '<!-- wp:group --><div class="wp-block-group"><!-- wp:heading --><h2>Hero</h2><!-- /wp:heading --><!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Explore</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:group -->',
  },
];

const mockParts: Template[] = [
  {
    slug: 'header',
    content: '<!-- wp:group --><div class="wp-block-group"><!-- wp:site-title /--></div><!-- /wp:group -->',
  },
  {
    slug: 'footer',
    content: '<!-- wp:group --><div class="wp-block-group"><!-- wp:paragraph --><p>Footer</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
  },
];

const mockTemplates: Template[] = [
  {
    slug: 'index',
    content: '<!-- wp:template-part {"slug":"header","area":"header"} /--><!-- wp:group --><div class="wp-block-group"><!-- wp:query --><div class="wp-block-query"><!-- wp:post-template --><!-- wp:post-title /--><!-- /wp:post-template --></div><!-- /wp:query --></div><!-- /wp:group --><!-- wp:template-part {"slug":"footer","area":"footer"} /-->',
  },
  {
    slug: 'home',
    content: '<!-- wp:template-part {"slug":"header","area":"header"} /--><!-- wp:pattern {"slug":"test-theme/hero"} /--><!-- wp:template-part {"slug":"footer","area":"footer"} /-->',
  },
  {
    slug: 'page',
    content: '<!-- wp:template-part {"slug":"header","area":"header"} /--><!-- wp:group --><div class="wp-block-group"><!-- wp:post-title /--><!-- wp:post-content /--></div><!-- /wp:group --><!-- wp:template-part {"slug":"footer","area":"footer"} /-->',
  },
  {
    slug: 'single',
    content: '<!-- wp:template-part {"slug":"header","area":"header"} /--><!-- wp:group --><div class="wp-block-group"><!-- wp:post-title /--><!-- wp:post-content /--></div><!-- /wp:group --><!-- wp:template-part {"slug":"footer","area":"footer"} /-->',
  },
  {
    slug: 'archive',
    content: '<!-- wp:template-part {"slug":"header","area":"header"} /--><!-- wp:group --><div class="wp-block-group"><!-- wp:query-title {"type":"archive"} /--></div><!-- /wp:group --><!-- wp:template-part {"slug":"footer","area":"footer"} /-->',
  },
  {
    slug: '404',
    content: '<!-- wp:template-part {"slug":"header","area":"header"} /--><!-- wp:group --><div class="wp-block-group"><!-- wp:heading --><h2>Not Found</h2><!-- /wp:heading --></div><!-- /wp:group --><!-- wp:template-part {"slug":"footer","area":"footer"} /-->',
  },
];

class MockProvider implements AIProvider {
  async generateThemeJSON(): Promise<ThemeJSON> {
    return mockThemeJson;
  }
  async generatePatterns(): Promise<{ patterns: Pattern[]; parts: Template[] }> {
    return { patterns: mockPatterns, parts: mockParts };
  }
  async generateTemplates(): Promise<Template[]> {
    return mockTemplates;
  }
  async correctThemeJSON(): Promise<ThemeJSON> {
    return mockThemeJson;
  }
  async correctPatterns(): Promise<{ patterns: Pattern[]; parts: Template[] }> {
    return { patterns: mockPatterns, parts: mockParts };
  }
  async correctTemplates(): Promise<Template[]> {
    return mockTemplates;
  }
}

describe('ThemeOrchestrator', () => {
  const prompt: ThemePrompt = {
    name: 'Test Theme',
    description: 'A test theme for testing',
  };

  test('runs full generation pipeline with mock provider', async () => {
    const progressLogs: GenerationProgress[] = [];
    const onProgress: ProgressCallback = (p) => progressLogs.push(p);

    const orchestrator = new ThemeOrchestrator(new MockProvider(), onProgress);
    const result = await orchestrator.generate(prompt);

    expect(result.name).toBe('Test Theme');
    expect(result.themeJson.version).toBe(2);
    expect(result.templates).toHaveLength(6);
    expect(result.patterns).toHaveLength(1);
    expect(result.parts).toHaveLength(2);

    // Check files assembled
    expect(result.files['style.css']).toContain('Theme Name: Test Theme');
    expect(result.files['theme.json']).toBeDefined();
    expect(result.files.templates['index.html']).toBeDefined();
    expect(result.files.parts['header.html']).toBeDefined();
    expect(result.files.patterns['hero.php']).toBeDefined();

    // Check progress was emitted
    expect(progressLogs.length).toBeGreaterThan(0);
    expect(progressLogs[progressLogs.length - 1].step).toBe('assembling');
  });

  test('rejects themes with wp:html blocks', async () => {
    const badPatterns = {
      patterns: [{
        slug: 'bad',
        title: 'Bad',
        categories: ['test'],
        content: '<!-- wp:html --><div>bad</div><!-- /wp:html -->',
      }],
      parts: mockParts,
    };
    class BadProvider extends MockProvider {
      async generatePatterns(): Promise<{ patterns: Pattern[]; parts: Template[] }> {
        return badPatterns;
      }
      async correctPatterns(): Promise<{ patterns: Pattern[]; parts: Template[] }> {
        return badPatterns;
      }
    }

    const orchestrator = new ThemeOrchestrator(new BadProvider());
    await expect(orchestrator.generate(prompt)).rejects.toThrow();
  });

  test('uses correction prompts on retry and recovers', async () => {
    let generateCalls = 0;
    let correctCalls = 0;

    class RecoveringProvider extends MockProvider {
      async generateThemeJSON(): Promise<ThemeJSON> {
        generateCalls++;
        // First call returns invalid version
        return { ...mockThemeJson, version: 99 as unknown as 2 };
      }
      async correctThemeJSON(): Promise<ThemeJSON> {
        correctCalls++;
        // Correction returns valid
        return mockThemeJson;
      }
    }

    const progressLogs: GenerationProgress[] = [];
    const orchestrator = new ThemeOrchestrator(
      new RecoveringProvider(),
      (p) => progressLogs.push(p)
    );
    const result = await orchestrator.generate(prompt);

    expect(generateCalls).toBe(1);
    expect(correctCalls).toBeGreaterThanOrEqual(1);
    expect(result.themeJson.version).toBe(2);
    expect(progressLogs.some((p) => p.message.includes('error correction'))).toBe(true);
  });
});
