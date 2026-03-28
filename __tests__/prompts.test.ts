import { SYSTEM_PROMPT } from '../src/ai/prompts/system';
import { buildThemeJsonPrompt, buildThemeJsonCorrectionPrompt, buildThemeJsonRefinementPrompt } from '../src/ai/prompts/theme-json';
import { buildPatternsPrompt, buildPatternsCorrectionPrompt } from '../src/ai/prompts/patterns';
import { buildTemplatesPrompt, buildTemplatesCorrectionPrompt } from '../src/ai/prompts/templates';
import { ThemePrompt, ThemeJSON } from '../src/types';

const mockPrompt: ThemePrompt = {
  name: 'Test Theme',
  description: 'A modern dark portfolio theme',
  colorPreferences: 'Navy and gold',
  typographyPreferences: 'Sans-serif headings',
  layoutPreferences: 'Wide layout',
};

const mockThemeJson: ThemeJSON = {
  version: 2,
  settings: {
    appearanceTools: true,
    color: {
      palette: [
        { slug: 'primary', color: '#1a365d', name: 'Primary' },
      ],
    },
  },
};

describe('System Prompt', () => {
  test('forbids wp:html', () => {
    expect(SYSTEM_PROMPT).toContain('NEVER use');
    expect(SYSTEM_PROMPT).toContain('wp:html');
  });

  test('includes allowed blocks list', () => {
    expect(SYSTEM_PROMPT).toContain('core/paragraph');
    expect(SYSTEM_PROMPT).toContain('core/heading');
  });

  test('requires JSON-only responses', () => {
    expect(SYSTEM_PROMPT).toContain('valid JSON');
  });
});

describe('Theme JSON Prompt', () => {
  test('includes theme name and description', () => {
    const prompt = buildThemeJsonPrompt(mockPrompt);
    expect(prompt).toContain('Test Theme');
    expect(prompt).toContain('A modern dark portfolio theme');
  });

  test('includes preferences when provided', () => {
    const prompt = buildThemeJsonPrompt(mockPrompt);
    expect(prompt).toContain('Navy and gold');
    expect(prompt).toContain('Sans-serif headings');
    expect(prompt).toContain('Wide layout');
  });

  test('omits preferences when not provided', () => {
    const prompt = buildThemeJsonPrompt({ name: 'Basic', description: 'Simple theme' });
    expect(prompt).not.toContain('Color Direction:');
    expect(prompt).not.toContain('Typography Direction:');
    expect(prompt).not.toContain('Layout Direction:');
  });

  test('correction prompt includes errors and previous output', () => {
    const prompt = buildThemeJsonCorrectionPrompt(
      ['version must be 2 or 3'],
      '{"version": 1}'
    );
    expect(prompt).toContain('version must be 2 or 3');
    expect(prompt).toContain('"version": 1');
  });
});

describe('Patterns Prompt', () => {
  test('includes theme.json context', () => {
    const prompt = buildPatternsPrompt(mockPrompt, mockThemeJson);
    expect(prompt).toContain('primary');
    expect(prompt).toContain('var(--wp--preset--color--SLUG)');
  });

  test('forbids wp:html', () => {
    const prompt = buildPatternsPrompt(mockPrompt, mockThemeJson);
    expect(prompt).toContain('NEVER use wp:html');
  });

  test('includes text domain', () => {
    const prompt = buildPatternsPrompt(mockPrompt, mockThemeJson);
    expect(prompt).toContain('test-theme');
  });

  test('correction prompt includes errors', () => {
    const prompt = buildPatternsCorrectionPrompt(['Unclosed blocks: core/group'], '{}');
    expect(prompt).toContain('Unclosed blocks: core/group');
  });
});

describe('Templates Prompt', () => {
  test('includes pattern and part slugs', () => {
    const prompt = buildTemplatesPrompt(mockPrompt, mockThemeJson, ['hero', 'cta'], ['header', 'footer']);
    expect(prompt).toContain('test-theme/hero');
    expect(prompt).toContain('test-theme/cta');
    expect(prompt).toContain('header');
    expect(prompt).toContain('footer');
  });

  test('forbids wp:html', () => {
    const prompt = buildTemplatesPrompt(mockPrompt, mockThemeJson, [], []);
    expect(prompt).toContain('NEVER use wp:html');
  });

  test('correction prompt includes errors', () => {
    const prompt = buildTemplatesCorrectionPrompt(['Invalid JSON attributes'], '{}');
    expect(prompt).toContain('Invalid JSON attributes');
  });
});

describe('Theme Refinement', () => {
  test('refinement prompt includes previous theme.json', () => {
    const refinementPrompt: ThemePrompt = {
      ...mockPrompt,
      refinementPrompt: 'Make the colors warmer',
      previousThemeJson: '{"version":2,"settings":{}}',
    };
    const prompt = buildThemeJsonRefinementPrompt(refinementPrompt, refinementPrompt.previousThemeJson!);
    expect(prompt).toContain('Make the colors warmer');
    expect(prompt).toContain('"version":2');
    expect(prompt).toContain('Test Theme');
  });

  test('refinement prompt instructs targeted changes', () => {
    const prompt = buildThemeJsonRefinementPrompt(
      { ...mockPrompt, refinementPrompt: 'Use serif fonts' },
      '{"version":2}'
    );
    expect(prompt).toContain('REFINE');
    expect(prompt).toContain('Use serif fonts');
    expect(prompt).toContain('Only change what the user asked for');
  });

  test('ThemePrompt type supports refinement fields', () => {
    const prompt: ThemePrompt = {
      name: 'Test',
      description: 'Test',
      refinementPrompt: 'Make it darker',
      previousThemeJson: '{}',
    };
    expect(prompt.refinementPrompt).toBe('Make it darker');
    expect(prompt.previousThemeJson).toBe('{}');
  });
});
