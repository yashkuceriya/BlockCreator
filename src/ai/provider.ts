import { AIProvider, ProviderName } from '../types';
import { AnthropicProvider } from './providers/anthropic';

export function createProvider(name?: ProviderName): AIProvider {
  const providerName = name || (process.env.AI_PROVIDER as ProviderName) || 'anthropic';

  switch (providerName) {
    case 'anthropic':
      return new AnthropicProvider();
    case 'openai':
      throw new Error('OpenAI provider not yet implemented');
    default:
      throw new Error(`Unknown provider: ${providerName}`);
  }
}
