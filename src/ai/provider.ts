import { AIProvider, ProviderName } from '../types';
import { AnthropicProvider } from './providers/anthropic';
import { OpenRouterProvider } from './providers/openrouter';

export function createProvider(name?: ProviderName): AIProvider {
  const providerName = name || (process.env.AI_PROVIDER as ProviderName) || 'auto';

  switch (providerName) {
    case 'anthropic':
      return new AnthropicProvider();
    case 'openrouter':
      return new OpenRouterProvider();
    case 'auto':
      return createAutoProvider();
    default:
      throw new Error(`Unknown provider: ${providerName}`);
  }
}

/**
 * Auto-select the best available provider.
 * Priority: Anthropic (most reliable) > OpenRouter (fallback)
 */
function createAutoProvider(): AIProvider {
  if (process.env.ANTHROPIC_API_KEY) {
    return new AnthropicProvider();
  }
  if (process.env.OPENROUTER_API_KEY) {
    try {
      return new OpenRouterProvider();
    } catch {
      // fall through
    }
  }
  throw new Error('No AI provider configured. Set ANTHROPIC_API_KEY or OPENROUTER_API_KEY in .env');
}
