import { generateStyleCSS } from '../src/assembler/style-css';
import { generateFunctionsPHP } from '../src/assembler/functions-php';
import { mapToThemeFiles } from '../src/assembler/file-mapper';
import { ThemeJSON, Template, Pattern } from '../src/types';

describe('Style CSS Generator', () => {
  test('generates valid style.css header', () => {
    const css = generateStyleCSS('My Test Theme', 'A test theme description');
    expect(css).toContain('Theme Name: My Test Theme');
    expect(css).toContain('Description: A test theme description');
    expect(css).toContain('Text Domain: my-test-theme');
    expect(css).toContain('Version: 1.0.0');
  });
});

describe('Functions PHP Generator', () => {
  test('generates valid functions.php', () => {
    const php = generateFunctionsPHP('My Test Theme');
    expect(php).toContain('<?php');
    expect(php).toContain('my-test-theme');
    expect(php).toContain('add_editor_style');
    expect(php).toContain('register_block_pattern_category');
    expect(php).toContain('my_test_theme_editor_styles');
    expect(php).toContain('my_test_theme_register_pattern_categories');
  });

  test('generates proper function names from theme name', () => {
    const php = generateFunctionsPHP('Cool Dark Theme');
    expect(php).toContain('cool_dark_theme_editor_styles');
    expect(php).toContain("'cool-dark-theme'");
  });
});

describe('File Mapper', () => {
  const mockThemeJson: ThemeJSON = {
    version: 2,
    settings: { appearanceTools: true },
  };

  const mockTemplates: Template[] = [
    { slug: 'index', content: '<!-- wp:paragraph --><p>Index</p><!-- /wp:paragraph -->' },
    { slug: 'single', content: '<!-- wp:paragraph --><p>Single</p><!-- /wp:paragraph -->' },
  ];

  const mockPatterns: Pattern[] = [
    { slug: 'hero', title: 'Hero', categories: ['featured'], content: '<!-- wp:group --><!-- /wp:group -->' },
  ];

  const mockParts: Template[] = [
    { slug: 'header', content: '<!-- wp:group --><!-- /wp:group -->' },
    { slug: 'footer', content: '<!-- wp:group --><!-- /wp:group -->' },
  ];

  test('maps all files correctly', () => {
    const files = mapToThemeFiles('Test Theme', 'desc', mockThemeJson, mockTemplates, mockPatterns, mockParts);

    expect(files['style.css']).toContain('Theme Name: Test Theme');
    expect(JSON.parse(files['theme.json'])).toEqual(mockThemeJson);
    expect(files.templates['index.html']).toContain('Index');
    expect(files.templates['single.html']).toContain('Single');
    expect(files.parts['header.html']).toBeDefined();
    expect(files.parts['footer.html']).toBeDefined();
    expect(files.patterns['hero.php']).toContain('Title: Hero');
    expect(files.patterns['hero.php']).toContain('Categories: featured');
    expect(files['functions.php']).toContain('<?php');
    expect(files['readme.txt']).toContain('Test Theme');
  });

  test('wraps patterns in PHP headers', () => {
    const files = mapToThemeFiles('Test Theme', 'desc', mockThemeJson, [], mockPatterns, []);
    const php = files.patterns['hero.php'];
    expect(php).toMatch(/^<\?php/);
    expect(php).toContain('Slug: test-theme/hero');
  });
});
