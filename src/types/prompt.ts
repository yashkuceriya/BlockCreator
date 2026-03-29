export const THEME_GENERATION_MODES = ['minimal', 'balanced', 'rich'] as const;
export type ThemeGenerationMode = typeof THEME_GENERATION_MODES[number];

export const HOMEPAGE_STYLES = ['landing', 'editorial', 'portfolio', 'business'] as const;
export type HomepageStyle = typeof HOMEPAGE_STYLES[number];

export const THEME_SECTION_OPTIONS = [
  'hero',
  'features',
  'about',
  'gallery',
  'team',
  'pricing',
  'testimonials',
  'faq',
  'call-to-action',
] as const;
export type ThemeSectionOption = typeof THEME_SECTION_OPTIONS[number];

export interface ThemeGenerationOptions {
  mode?: ThemeGenerationMode;
  homepageStyle?: HomepageStyle;
  sections?: ThemeSectionOption[];
}

export interface ThemePrompt {
  description: string;
  name: string;
  colorPreferences?: string;
  typographyPreferences?: string;
  layoutPreferences?: string;
  generationOptions?: ThemeGenerationOptions;
  /** For iteration: refinement instruction applied to a previously generated theme */
  refinementPrompt?: string;
  /** For iteration: the previous theme.json to refine */
  previousThemeJson?: string;
}

const STYLE_DEFAULT_SECTIONS: Record<HomepageStyle, ThemeSectionOption[]> = {
  landing: ['hero', 'features', 'pricing', 'testimonials', 'faq', 'call-to-action'],
  editorial: ['hero', 'about', 'features', 'gallery', 'testimonials', 'call-to-action'],
  portfolio: ['hero', 'gallery', 'about', 'team', 'testimonials', 'call-to-action'],
  business: ['hero', 'features', 'about', 'team', 'testimonials', 'call-to-action'],
};

const MODE_SECTION_LIMITS: Record<ThemeGenerationMode, number> = {
  minimal: 3,
  balanced: 5,
  rich: 6,
};

export interface ResolvedGenerationOptions {
  mode: ThemeGenerationMode;
  homepageStyle: HomepageStyle;
  sections: ThemeSectionOption[];
}

export function resolveGenerationOptions(
  options?: ThemeGenerationOptions
): ResolvedGenerationOptions {
  const mode = options?.mode && THEME_GENERATION_MODES.includes(options.mode)
    ? options.mode
    : 'balanced';
  const homepageStyle = options?.homepageStyle && HOMEPAGE_STYLES.includes(options.homepageStyle)
    ? options.homepageStyle
    : 'landing';

  const selectedSections = (options?.sections || [])
    .filter((section): section is ThemeSectionOption => THEME_SECTION_OPTIONS.includes(section))
    .filter((section, index, all) => all.indexOf(section) === index);

  const sections = selectedSections.length > 0
    ? selectedSections
    : STYLE_DEFAULT_SECTIONS[homepageStyle].slice(0, MODE_SECTION_LIMITS[mode]);

  return { mode, homepageStyle, sections };
}

export interface GenerationProgress {
  step: 'theme-json' | 'patterns' | 'templates' | 'assembling' | 'complete' | 'error';
  message: string;
  progress: number; // 0-100
  data?: unknown;
}
