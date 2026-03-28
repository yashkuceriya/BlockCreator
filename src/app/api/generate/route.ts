import { NextRequest } from 'next/server';
import { ThemeOrchestrator } from '../../../ai/orchestrator';
import { createProvider } from '../../../ai/provider';
import { packageThemeAsBuffer } from '../../../assembler';
import { sanitizeThemeName } from '../../../lib/sanitize';
import { validateInput, checkRateLimit } from '../../../lib/guardrails';
import { ThemePrompt, GenerationProgress } from '../../../types';

const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const MAX_PREFERENCE_LENGTH = 500;

function sanitizeInput(val: unknown, maxLength: number): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLength);
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.safe) {
    return jsonError(rateCheck.reason!, 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const description = sanitizeInput(body.description, MAX_DESCRIPTION_LENGTH);
  const name = sanitizeInput(body.name, MAX_NAME_LENGTH) || 'My Theme';

  if (!description) {
    return jsonError('Description is required', 400);
  }

  if (description.length < 10) {
    return jsonError('Description must be at least 10 characters', 400);
  }

  // Guardrails: check all user inputs for prompt injection and content safety
  const allInput = [description, name, body.colorPreferences, body.typographyPreferences, body.layoutPreferences]
    .filter(Boolean)
    .join(' ');

  const guardrailCheck = validateInput(allInput);
  if (!guardrailCheck.safe) {
    return jsonError(guardrailCheck.reason!, 400);
  }

  const refinementPrompt = sanitizeInput(body.refinementPrompt, MAX_DESCRIPTION_LENGTH) || undefined;
  const previousThemeJson = typeof body.previousThemeJson === 'string' ? body.previousThemeJson.slice(0, 50000) : undefined;

  const prompt: ThemePrompt = {
    name,
    description,
    colorPreferences: sanitizeInput(body.colorPreferences, MAX_PREFERENCE_LENGTH) || undefined,
    typographyPreferences: sanitizeInput(body.typographyPreferences, MAX_PREFERENCE_LENGTH) || undefined,
    layoutPreferences: sanitizeInput(body.layoutPreferences, MAX_PREFERENCE_LENGTH) || undefined,
    refinementPrompt,
    previousThemeJson,
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
