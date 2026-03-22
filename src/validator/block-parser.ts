export interface ParsedBlock {
  name: string;
  attributes: Record<string, unknown>;
  isClosing: boolean;
  isSelfClosing: boolean;
  raw: string;
  position: number;
}

// Matches closing: <!-- /wp:blockname -->
const BLOCK_CLOSE_REGEX = /<!--\s+\/wp:([a-z][a-z0-9-]*(?:\/[a-z][a-z0-9-]*)?)\s+-->/g;

function normalizeName(raw: string): string {
  return raw.includes('/') ? raw : `core/${raw}`;
}

/**
 * Extract balanced JSON from a string starting at position `start` (which should point to '{').
 * Returns the JSON substring or null if braces don't balance.
 */
function extractBalancedJSON(str: string, start: number): string | null {
  if (str[start] !== '{') return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < str.length; i++) {
    const ch = str[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    if (ch === '}') { depth--; if (depth === 0) return str.slice(start, i + 1); }
  }
  return null;
}

// Matches the start of an opening/self-closing block comment
const BLOCK_OPEN_START = /<!--\s+wp:([a-z][a-z0-9-]*(?:\/[a-z][a-z0-9-]*)?)\s*/g;

export function parseBlocks(markup: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];

  // Parse opening/self-closing blocks using a two-pass approach for nested JSON
  let match: RegExpExecArray | null;
  const openRegex = new RegExp(BLOCK_OPEN_START.source, 'g');
  while ((match = openRegex.exec(markup)) !== null) {
    const blockName = normalizeName(match[1]);
    const afterName = match.index + match[0].length;
    let attributes: Record<string, unknown> = {};
    let endPos = afterName;

    // Check if there's a JSON attribute block
    if (markup[afterName] === '{') {
      const jsonStr = extractBalancedJSON(markup, afterName);
      if (jsonStr) {
        try {
          attributes = JSON.parse(jsonStr);
        } catch {
          attributes = { __parseError: true, __raw: jsonStr };
        }
        endPos = afterName + jsonStr.length;
      }
    }

    // Find the closing --> or /-->
    const remaining = markup.slice(endPos);
    const closeMatch = remaining.match(/^\s*(\/)?-->/);
    if (!closeMatch) continue; // Not a valid block comment

    const isSelfClosing = !!closeMatch[1];
    const fullEnd = endPos + closeMatch[0].length;
    const raw = markup.slice(match.index, fullEnd);

    blocks.push({
      name: blockName,
      attributes,
      isClosing: false,
      isSelfClosing,
      raw,
      position: match.index,
    });

    // Advance regex past this block comment
    openRegex.lastIndex = fullEnd;
  }

  // Parse closing blocks
  const closeRegex = new RegExp(BLOCK_CLOSE_REGEX.source, 'g');
  while ((match = closeRegex.exec(markup)) !== null) {
    const blockName = normalizeName(match[1]);
    blocks.push({
      name: blockName,
      attributes: {},
      isClosing: true,
      isSelfClosing: false,
      raw: match[0],
      position: match.index,
    });
  }

  // Sort by position in source
  blocks.sort((a, b) => a.position - b.position);

  return blocks;
}

export function extractBlockNames(markup: string): string[] {
  const blocks = parseBlocks(markup);
  const names = new Set(blocks.map((b) => b.name));
  return Array.from(names);
}
