import { POST } from '../src/app/api/generate/route';
import { NextRequest } from 'next/server';

// Mock the provider so we don't need real API keys
jest.mock('../src/ai/provider', () => ({
  createProvider: () => ({
    generateThemeJSON: jest.fn().mockResolvedValue({
      version: 2,
      settings: { appearanceTools: true },
    }),
    generatePatterns: jest.fn().mockResolvedValue({
      patterns: [
        {
          slug: 'hero',
          title: 'Hero',
          categories: ['featured'],
          content: '<!-- wp:heading --><h2>Hero</h2><!-- /wp:heading -->',
        },
      ],
      parts: [
        { slug: 'header', content: '<!-- wp:site-title /-->' },
        { slug: 'footer', content: '<!-- wp:paragraph --><p>Footer</p><!-- /wp:paragraph -->' },
      ],
    }),
    generateTemplates: jest.fn().mockResolvedValue([
      {
        slug: 'index',
        content: '<!-- wp:template-part {"slug":"header","area":"header"} /--><!-- wp:post-content /--><!-- wp:template-part {"slug":"footer","area":"footer"} /-->',
      },
    ]),
    correctThemeJSON: jest.fn(),
    correctPatterns: jest.fn(),
    correctTemplates: jest.fn(),
  }),
}));

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function readStream(response: Response): Promise<string[]> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  const lines: string[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value);
    const dataLines = text.split('\n').filter((l) => l.startsWith('data: '));
    lines.push(...dataLines.map((l) => l.slice(6)));
  }

  return lines;
}

describe('POST /api/generate', () => {
  test('rejects empty body', async () => {
    const req = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('Description is required');
  });

  test('rejects missing description', async () => {
    const res = await POST(makeRequest({ name: 'Test' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('Description is required');
  });

  test('rejects too-short description', async () => {
    const res = await POST(makeRequest({ description: 'short' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('at least 10 characters');
  });

  test('returns SSE stream for valid input', async () => {
    const res = await POST(makeRequest({
      name: 'Test Theme',
      description: 'A beautiful modern portfolio theme with dark colors',
    }));

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/event-stream');

    const events = await readStream(res);
    expect(events.length).toBeGreaterThan(0);

    // Each event should be valid JSON
    for (const event of events) {
      const parsed = JSON.parse(event);
      expect(parsed).toHaveProperty('step');
      expect(parsed).toHaveProperty('message');
      expect(parsed).toHaveProperty('progress');
    }

    // Last event should be complete
    const last = JSON.parse(events[events.length - 1]);
    expect(last.step).toBe('complete');
    expect(last.progress).toBe(100);
  });

  test('uses default name when not provided', async () => {
    const res = await POST(makeRequest({
      description: 'A beautiful modern portfolio theme with dark colors',
    }));

    expect(res.status).toBe(200);
    const events = await readStream(res);
    const last = JSON.parse(events[events.length - 1]);
    expect(last.data.themeSlug).toBe('my-theme');
  });
});
