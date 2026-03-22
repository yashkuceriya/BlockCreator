import { NextRequest } from 'next/server';
import { ThemeOrchestrator } from '../../../ai/orchestrator';
import { createProvider } from '../../../ai/provider';
import { packageThemeAsBuffer } from '../../../assembler';
import { sanitizeThemeName } from '../../../lib/sanitize';
import { ThemePrompt, GenerationProgress } from '../../../types';

const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const MAX_PREFERENCE_LENGTH = 500;

function sanitizeInput(val: unknown, maxLength: number): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const description = sanitizeInput(body.description, MAX_DESCRIPTION_LENGTH);
  const name = sanitizeInput(body.name, MAX_NAME_LENGTH) || 'My Theme';

  if (!description) {
    return new Response(JSON.stringify({ error: 'Description is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (description.length < 10) {
    return new Response(JSON.stringify({ error: 'Description must be at least 10 characters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const prompt: ThemePrompt = {
    name,
    description,
    colorPreferences: sanitizeInput(body.colorPreferences, MAX_PREFERENCE_LENGTH) || undefined,
    typographyPreferences: sanitizeInput(body.typographyPreferences, MAX_PREFERENCE_LENGTH) || undefined,
    layoutPreferences: sanitizeInput(body.layoutPreferences, MAX_PREFERENCE_LENGTH) || undefined,
  };

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: GenerationProgress) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const provider = createProvider();
        const orchestrator = new ThemeOrchestrator(provider, send);
        const theme = await orchestrator.generate(prompt);

        const themeSlug = sanitizeThemeName(prompt.name);
        const zipBuffer = await packageThemeAsBuffer(themeSlug, theme.files);
        const zipBase64 = zipBuffer.toString('base64');

        send({
          step: 'complete',
          message: 'Theme generation complete!',
          progress: 100,
          data: {
            files: theme.files,
            zipBase64,
            themeSlug,
          },
        });
      } catch (error) {
        send({
          step: 'error',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          progress: 0,
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
