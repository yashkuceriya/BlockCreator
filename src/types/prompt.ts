export interface ThemePrompt {
  description: string;
  name: string;
  colorPreferences?: string;
  typographyPreferences?: string;
  layoutPreferences?: string;
  /** For iteration: refinement instruction applied to a previously generated theme */
  refinementPrompt?: string;
  /** For iteration: the previous theme.json to refine */
  previousThemeJson?: string;
}

export interface GenerationProgress {
  step: 'theme-json' | 'patterns' | 'templates' | 'assembling' | 'complete' | 'error';
  message: string;
  progress: number; // 0-100
  data?: unknown;
}
