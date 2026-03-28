/**
 * LLM input guardrails — detect prompt injection and inappropriate content.
 */

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|rules|prompts)/i,
  /disregard\s+(all\s+)?(previous|above|prior)/i,
  /you\s+are\s+now\s+/i,
  /pretend\s+(you\s+are|to\s+be)\s+/i,
  /act\s+as\s+(if|though)\s+/i,
  /new\s+instructions?\s*:/i,
  /system\s*:\s*/i,
  /\[INST\]/i,
  /<<SYS>>/i,
  /<\|im_start\|>/i,
  /jailbreak/i,
  /DAN\s+mode/i,
];

const CONTENT_BLOCKLIST = [
  /\b(phishing|malware|ransomware|exploit|vulnerability\s+scanner)\b/i,
  /\b(dark\s+web\s+market|drug\s+deal|weapon\s+sale)\b/i,
];

export interface GuardrailResult {
  safe: boolean;
  reason?: string;
}

export function checkPromptInjection(input: string): GuardrailResult {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return { safe: false, reason: 'Input appears to contain prompt injection. Please describe your theme naturally.' };
    }
  }
  return { safe: true };
}

export function checkContentSafety(input: string): GuardrailResult {
  for (const pattern of CONTENT_BLOCKLIST) {
    if (pattern.test(input)) {
      return { safe: false, reason: 'Input contains content that cannot be used for theme generation.' };
    }
  }
  return { safe: true };
}

export function validateInput(input: string): GuardrailResult {
  const injection = checkPromptInjection(input);
  if (!injection.safe) return injection;

  const content = checkContentSafety(input);
  if (!content.safe) return content;

  return { safe: true };
}

/**
 * In-memory rate limiter with bounded cardinality.
 * In production, use Redis or edge KV for distributed limiting.
 */
const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute
const MAX_TRACKED_CLIENTS = 10_000; // prevent memory exhaustion

/**
 * Parse a canonical client IP from request headers.
 * Takes the first IP from X-Forwarded-For (leftmost = original client),
 * falls back to X-Real-IP, then to a static key.
 */
export function parseClientIp(
  forwarded: string | null,
  realIp: string | null
): string {
  if (forwarded) {
    // X-Forwarded-For can be comma-separated: "client, proxy1, proxy2"
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  if (realIp) return realIp.trim();
  return 'anonymous';
}

export function checkRateLimit(clientId: string): GuardrailResult {
  const now = Date.now();

  // Periodic cleanup: evict expired entries and cap cardinality
  if (requestLog.size > MAX_TRACKED_CLIENTS) {
    for (const [key, timestamps] of requestLog) {
      const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) {
        requestLog.delete(key);
      } else {
        requestLog.set(key, valid);
      }
    }
    // If still over limit after cleanup, evict oldest entries
    if (requestLog.size > MAX_TRACKED_CLIENTS) {
      const excess = requestLog.size - MAX_TRACKED_CLIENTS;
      const keys = requestLog.keys();
      for (let i = 0; i < excess; i++) {
        const next = keys.next();
        if (!next.done) requestLog.delete(next.value);
      }
    }
  }

  const timestamps = requestLog.get(clientId) || [];
  const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (valid.length >= RATE_LIMIT_MAX) {
    return { safe: false, reason: 'Rate limit exceeded. Please wait a moment before generating again.' };
  }

  valid.push(now);
  requestLog.set(clientId, valid);
  return { safe: true };
}

/** Exported for testing */
export function _resetRateLimitState(): void {
  requestLog.clear();
}
