import { validateBlockMarkup } from '../src/validator';
import { sanitizeThemeName, sanitizeSlug } from '../src/lib/sanitize';
import { withRetry } from '../src/lib/retry';

describe('Edge Cases: Prompt injection attempts', () => {
  test('blocks with injection-like attributes are still validated', () => {
    const markup = '<!-- wp:paragraph {"content":"</script><script>alert(1)</script>"} --><p>test</p><!-- /wp:paragraph -->';
    const result = validateBlockMarkup(markup);
    // The block itself is valid core/paragraph — attribute content is just data
    expect(result.valid).toBe(true);
  });

  test('wp:html disguised with extra attributes is still rejected', () => {
    const markup = '<!-- wp:html {"className":"safe"} --><div>hack</div><!-- /wp:html -->';
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('HARD REJECT'))).toBe(true);
  });
});

describe('Edge Cases: Theme name sanitization', () => {
  test('handles empty string', () => {
    expect(sanitizeThemeName('')).toBe('');
  });

  test('handles unicode characters', () => {
    const result = sanitizeThemeName('Thème Génial');
    expect(result).toBe('thme-gnial');
  });

  test('handles only special characters', () => {
    const result = sanitizeThemeName('!@#$%^&*()');
    expect(result).toBe('');
  });

  test('handles very long names', () => {
    const result = sanitizeThemeName('A'.repeat(200));
    expect(result.length).toBeLessThanOrEqual(50);
  });
});

describe('Edge Cases: Slug sanitization', () => {
  test('handles spaces and special chars', () => {
    expect(sanitizeSlug('My Hero Section!!')).toBe('my-hero-section');
  });

  test('collapses multiple dashes', () => {
    expect(sanitizeSlug('a---b')).toBe('a-b');
  });
});

describe('Edge Cases: Retry mechanism', () => {
  test('succeeds on first attempt', async () => {
    let calls = 0;
    const result = await withRetry(async () => {
      calls++;
      return 'ok';
    });
    expect(result).toBe('ok');
    expect(calls).toBe(1);
  });

  test('retries on failure and succeeds', async () => {
    let calls = 0;
    const result = await withRetry(async (attempt) => {
      calls++;
      if (attempt < 1) throw new Error('fail');
      return 'recovered';
    });
    expect(result).toBe('recovered');
    expect(calls).toBe(2);
  });

  test('throws after max retries', async () => {
    let calls = 0;
    await expect(
      withRetry(async () => {
        calls++;
        throw new Error('persistent failure');
      }, 2)
    ).rejects.toThrow('persistent failure');
    expect(calls).toBe(3); // initial + 2 retries
  });

  test('passes attempt number and last error', async () => {
    const attempts: number[] = [];
    const errors: (Error | undefined)[] = [];

    await withRetry(async (attempt, lastError) => {
      attempts.push(attempt);
      errors.push(lastError);
      if (attempt < 2) throw new Error(`fail-${attempt}`);
      return 'done';
    }, 2);

    expect(attempts).toEqual([0, 1, 2]);
    expect(errors[0]).toBeUndefined();
    expect(errors[1]?.message).toBe('fail-0');
    expect(errors[2]?.message).toBe('fail-1');
  });
});

describe('Edge Cases: Block markup edge cases', () => {
  test('markup with only text (no blocks) is valid', () => {
    const result = validateBlockMarkup('<p>Just plain HTML, no blocks</p>');
    expect(result.valid).toBe(true);
  });

  test('multiple wp:html blocks all detected', () => {
    const markup = '<!-- wp:html --><div>1</div><!-- /wp:html --><!-- wp:html --><div>2</div><!-- /wp:html -->';
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(false);
  });

  test('deeply nested valid structure', () => {
    const markup = `
<!-- wp:group -->
<div class="wp-block-group">
<!-- wp:group -->
<div class="wp-block-group">
<!-- wp:group -->
<div class="wp-block-group">
<!-- wp:paragraph -->
<p>Deep</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->`;
    const result = validateBlockMarkup(markup);
    expect(result.valid).toBe(true);
  });
});
