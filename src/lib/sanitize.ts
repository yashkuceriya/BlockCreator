export function sanitizeThemeName(name: string): string {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 50);
}

export function sanitizeSlug(slug: string): string {
  return slug
    .trim()
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export function escapeForComment(text: string): string {
  return text.replace(/\*\//g, '* /').replace(/\*\\/g, '* \\');
}

export function escapeForPHPString(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

export function stripMarkdownCodeFence(text: string): string {
  return text
    .replace(/^```(?:json|html|php|text)?\s*\n?/gm, '')
    .replace(/\n?```\s*$/gm, '')
    .trim();
}
