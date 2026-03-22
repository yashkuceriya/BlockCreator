import { MAX_RETRIES } from './constants';

export async function withRetry<T>(
  fn: (attempt: number, lastError?: Error) => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn(attempt, lastError);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === maxRetries) throw lastError;
    }
  }
  throw lastError;
}
