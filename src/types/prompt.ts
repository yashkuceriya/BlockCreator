export interface ThemePrompt {
  description: string;
  name: string;
  colorPreferences?: string;
  typographyPreferences?: string;
  layoutPreferences?: string;
}

export interface GenerationProgress {
  step: 'theme-json' | 'patterns' | 'templates' | 'assembling' | 'complete' | 'error';
  message: string;
  progress: number; // 0-100
  data?: unknown;
}
