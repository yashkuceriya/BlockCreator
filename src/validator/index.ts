import { ALLOWED_BLOCKS, HARD_REJECTED_BLOCKS } from '../lib/constants';
import { BlockNotAllowedError, ValidationError } from '../lib/errors';
import { parseBlocks, ParsedBlock } from './block-parser';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateBlockMarkup(markup: string): ValidationResult {
  const errors: string[] = [];
  const blocks = parseBlocks(markup);

  // Check for hard-rejected blocks (wp:html)
  const rejected = blocks.filter((b) => HARD_REJECTED_BLOCKS.has(b.name));
  if (rejected.length > 0) {
    const names = [...new Set(rejected.map((b) => b.name))];
    errors.push(`HARD REJECT: Custom HTML blocks are forbidden: ${names.join(', ')}`);
  }

  // Check all blocks against allowlist
  const disallowed = blocks.filter(
    (b) => !ALLOWED_BLOCKS.has(b.name) && !HARD_REJECTED_BLOCKS.has(b.name)
  );
  if (disallowed.length > 0) {
    const names = [...new Set(disallowed.map((b) => b.name))];
    errors.push(`Blocks not in allowlist: ${names.join(', ')}`);
  }

  // Verify attribute JSON is valid
  const parseErrors = blocks.filter(
    (b) => b.attributes && '__parseError' in b.attributes
  );
  if (parseErrors.length > 0) {
    errors.push(
      `Invalid JSON attributes in blocks: ${parseErrors.map((b) => b.raw).join('; ')}`
    );
  }

  // Verify nesting balance
  const nestingErrors = checkNestingBalance(blocks);
  errors.push(...nestingErrors);

  return { valid: errors.length === 0, errors };
}

function checkNestingBalance(blocks: ParsedBlock[]): string[] {
  const errors: string[] = [];
  const stack: string[] = [];

  // Blocks are already ordered by position from parseBlocks()
  // Filter to only opening and closing blocks (not self-closing)
  const ordered = blocks.filter((b) => !b.isSelfClosing);

  for (const block of ordered) {
    if (block.isClosing) {
      if (stack.length === 0) {
        errors.push(`Unexpected closing block: ${block.name}`);
      } else {
        const expected = stack.pop();
        if (expected !== block.name) {
          errors.push(
            `Mismatched block nesting: expected closing ${expected}, got ${block.name}`
          );
        }
      }
    } else if (!block.isSelfClosing) {
      stack.push(block.name);
    }
  }

  if (stack.length > 0) {
    errors.push(`Unclosed blocks: ${stack.join(', ')}`);
  }

  return errors;
}

export function validateBlockMarkupStrict(markup: string): void {
  const result = validateBlockMarkup(markup);
  if (!result.valid) {
    const rejected = result.errors.filter((e) => e.startsWith('HARD REJECT'));
    if (rejected.length > 0) {
      throw new BlockNotAllowedError(['core/html']);
    }
    throw new ValidationError('Block markup validation failed', result.errors);
  }
}

export function validateThemeJsonStructure(json: unknown): ValidationResult {
  const errors: string[] = [];
  if (typeof json !== 'object' || json === null) {
    return { valid: false, errors: ['theme.json must be an object'] };
  }

  const obj = json as Record<string, unknown>;
  if (obj.version !== 2 && obj.version !== 3) {
    errors.push('theme.json version must be 2 or 3');
  }

  return { valid: errors.length === 0, errors };
}

export { parseBlocks, extractBlockNames } from './block-parser';
