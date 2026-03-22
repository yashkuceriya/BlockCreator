export interface ThemeJSON {
  $schema?: string;
  version: 2 | 3;
  settings?: ThemeSettings;
  styles?: ThemeStyles;
  templateParts?: TemplatePart[];
  customTemplates?: CustomTemplate[];
}

export interface ThemeSettings {
  appearanceTools?: boolean;
  color?: {
    palette?: ColorPalette[];
    gradients?: Gradient[];
    duotone?: Duotone[];
    defaultPalette?: boolean;
    defaultGradients?: boolean;
  };
  typography?: {
    fontFamilies?: FontFamily[];
    fontSizes?: FontSize[];
    fluid?: boolean;
  };
  spacing?: {
    spacingScale?: {
      steps?: number;
    };
    units?: string[];
  };
  layout?: {
    contentSize?: string;
    wideSize?: string;
  };
  useRootPaddingAwareAlignments?: boolean;
  blocks?: Record<string, unknown>;
}

export interface ThemeStyles {
  color?: { background?: string; text?: string };
  typography?: { fontFamily?: string; fontSize?: string; lineHeight?: string };
  spacing?: { padding?: SpacingValue; margin?: SpacingValue; blockGap?: string };
  elements?: Record<string, unknown>;
  blocks?: Record<string, unknown>;
}

export interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface ColorPalette {
  slug: string;
  color: string;
  name: string;
}

export interface Gradient {
  slug: string;
  gradient: string;
  name: string;
}

export interface Duotone {
  slug: string;
  colors: string[];
  name: string;
}

export interface FontFamily {
  fontFamily: string;
  slug: string;
  name: string;
  fontFace?: FontFace[];
}

export interface FontFace {
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  src: string[];
}

export interface FontSize {
  slug: string;
  size: string;
  name: string;
  fluid?: { min: string; max: string } | boolean;
}

export interface TemplatePart {
  name: string;
  title: string;
  area: 'header' | 'footer' | 'uncategorized';
}

export interface CustomTemplate {
  name: string;
  title: string;
  postTypes?: string[];
}

export interface Template {
  slug: string;
  content: string;
}

export interface Pattern {
  slug: string;
  title: string;
  categories: string[];
  content: string;
}

export interface ThemeFiles {
  'style.css': string;
  'theme.json': string;
  'functions.php': string;
  'readme.txt': string;
  templates: Record<string, string>;
  parts: Record<string, string>;
  patterns: Record<string, string>;
}

export interface GeneratedTheme {
  name: string;
  themeJson: ThemeJSON;
  templates: Template[];
  patterns: Pattern[];
  parts: Template[];
  files: ThemeFiles;
}
