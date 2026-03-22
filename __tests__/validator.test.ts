import { validateBlockMarkup, parseBlocks, extractBlockNames } from '../src/validator';

describe('Block Parser', () => {
  test('parses self-closing blocks', () => {
    const markup = '<!-- wp:separator /-->';
    const blocks = parseBlocks(markup);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].name).toBe('core/separator');
    expect(blocks[0].isSelfClosing).toBe(true);
  });

  test('parses blocks with attributes', () => {
    const markup = '<!-- wp:heading {"level":2,"textAlign":"center"} --><h2 class="has-text-align-center">Hello</h2><!-- /wp:heading -->';
    const blocks = parseBlocks(markup);
    const opening = blocks.find((b) => !b.isClosing);
    expect(opening).toBeDefined();
    expect(opening!.name).toBe('core/heading');
    expect(opening!.attributes).toEqual({ level: 2, textAlign: 'center' });
  });

  test('parses nested blocks', () => {
    const markup = `<!-- wp:group -->
<div class="wp-block-group">
<!-- wp:paragraph -->
<p>Hello</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->`;
    const names = extractBlockNames(markup);
    expect(names).toContain('core/group');
    expect(names).toContain('core/paragraph');
  });

  test('parses template-part references', () => {
    const markup = '<!-- wp:template-part {"slug":"header","area":"header"} /-->';
    const blocks = parseBlocks(markup);
    expect(blocks[0].name).toBe('core/template-part');
    expect(blocks[0].attributes).toEqual({ slug: 'header', area: 'header' });
  });
});

describe('Block Validator', () => {
  test('accepts valid core blocks', () => {
    const markup = `<!-- wp:group -->
<div class="wp-block-group">
<!-- wp:heading -->
<h2>Hello</h2>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>World</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->`;
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('HARD REJECTS wp:html (Custom HTML block)', () => {
    const markup = '<!-- wp:html --><div>custom</div><!-- /wp:html -->';
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('HARD REJECT'))).toBe(true);
    expect(result.errors.some((e) => e.includes('core/html'))).toBe(true);
  });

  test('rejects blocks not in allowlist', () => {
    const markup = '<!-- wp:fake-plugin/custom-block /-->';
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('not in allowlist'))).toBe(true);
  });

  test('accepts self-closing blocks', () => {
    const markup = '<!-- wp:separator /-->';
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(true);
  });

  test('accepts template-part and pattern blocks', () => {
    const markup = `<!-- wp:template-part {"slug":"header","area":"header"} /-->
<!-- wp:pattern {"slug":"my-theme/hero"} /-->`;
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(true);
  });

  test('reports invalid JSON attributes', () => {
    const markup = '<!-- wp:heading {invalid json} --><h2>Hi</h2><!-- /wp:heading -->';
    const result = validateBlockMarkup(markup);
    expect(result.errors.some((e) => e.includes('Invalid JSON'))).toBe(true);
  });

  test('detects mismatched nesting', () => {
    const markup = '<!-- wp:group --><div><!-- /wp:paragraph -->';
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Mismatched') || e.includes('Unclosed') || e.includes('Unexpected'))).toBe(true);
  });

  test('detects unclosed blocks', () => {
    const markup = '<!-- wp:group --><div>content</div>';
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Unclosed'))).toBe(true);
  });

  test('accepts empty markup', () => {
    const result = validateBlockMarkup('');
    expect(result.valid).toBe(true);
  });

  test('accepts complex nested structures', () => {
    const markup = `<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
<!-- wp:columns -->
<div class="wp-block-columns">
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:heading {"level":3} -->
<h3>Title</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Text</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:image /-->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
</div>
<!-- /wp:group -->`;
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(true);
  });
});
