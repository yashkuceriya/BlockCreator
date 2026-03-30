import { NextRequest } from 'next/server';
import { ThemeOrchestrator } from '../../../ai/orchestrator';
import { createProvider } from '../../../ai/provider';
import { ProviderName } from '../../../types';
import { packageThemeAsBuffer } from '../../../assembler';
import { sanitizeThemeName } from '../../../lib/sanitize';
import { validateInput, checkRateLimit, parseClientIp } from '../../../lib/guardrails';
import {
  ThemePrompt,
  GenerationProgress,
  THEME_GENERATION_MODES,
  HOMEPAGE_STYLES,
  THEME_SECTION_OPTIONS,
} from '../../../types';

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

function sanitizeGenerationOptions(input: unknown): ThemePrompt['generationOptions'] | undefined {
  if (!input || typeof input !== 'object') return undefined;

  const raw = input as Record<string, unknown>;
  const mode = typeof raw.mode === 'string' && THEME_GENERATION_MODES.includes(raw.mode as typeof THEME_GENERATION_MODES[number])
    ? (raw.mode as typeof THEME_GENERATION_MODES[number])
    : undefined;
  const homepageStyle = typeof raw.homepageStyle === 'string' && HOMEPAGE_STYLES.includes(raw.homepageStyle as typeof HOMEPAGE_STYLES[number])
    ? (raw.homepageStyle as typeof HOMEPAGE_STYLES[number])
    : undefined;
  const sections = Array.isArray(raw.sections)
    ? (raw.sections
      .filter((section): section is string => typeof section === 'string')
      .filter((section) => THEME_SECTION_OPTIONS.includes(section as typeof THEME_SECTION_OPTIONS[number]))
      .filter((section, index, all) => all.indexOf(section) === index)
      .slice(0, 8) as typeof THEME_SECTION_OPTIONS[number][])
    : undefined;

  if (!mode && !homepageStyle && (!sections || sections.length === 0)) return undefined;

  return {
    mode,
    homepageStyle,
    sections: sections && sections.length > 0 ? sections : undefined,
  };
}

export async function POST(request: NextRequest) {
  // Rate limiting — parse canonical client IP
  const clientIp = parseClientIp(
    request.headers.get('x-forwarded-for'),
    request.headers.get('x-real-ip')
  );
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
    generationOptions: sanitizeGenerationOptions(body.generationOptions),
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
        // Use client-selected provider if valid, otherwise auto-select
        const requestedProvider = typeof body.provider === 'string' && ['auto', 'anthropic', 'openrouter'].includes(body.provider)
          ? (body.provider as ProviderName)
          : undefined;
        const provider = createProvider(requestedProvider);
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
