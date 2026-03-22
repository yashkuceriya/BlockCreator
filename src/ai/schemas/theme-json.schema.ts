import { z } from 'zod';

const colorPaletteSchema = z.object({
  slug: z.string(),
  color: z.string(),
  name: z.string(),
});

const fontFamilySchema = z.object({
  fontFamily: z.string(),
  slug: z.string(),
  name: z.string(),
  fontFace: z.array(z.object({
    fontFamily: z.string(),
    fontWeight: z.string(),
    fontStyle: z.string(),
    src: z.array(z.string()),
  })).optional(),
});

const fontSizeSchema = z.object({
  slug: z.string(),
  size: z.string(),
  name: z.string(),
  fluid: z.union([z.object({ min: z.string(), max: z.string() }), z.boolean()]).optional(),
});

export const themeJsonSchema = z.object({
  $schema: z.string().optional(),
  version: z.union([z.literal(2), z.literal(3)]),
  settings: z.object({
    appearanceTools: z.boolean().optional(),
    color: z.object({
      palette: z.array(colorPaletteSchema).optional(),
      gradients: z.array(z.object({ slug: z.string(), gradient: z.string(), name: z.string() })).optional(),
      defaultPalette: z.boolean().optional(),
      defaultGradients: z.boolean().optional(),
    }).optional(),
    typography: z.object({
      fontFamilies: z.array(fontFamilySchema).optional(),
      fontSizes: z.array(fontSizeSchema).optional(),
      fluid: z.boolean().optional(),
    }).optional(),
    spacing: z.object({
      spacingScale: z.object({ steps: z.number() }).optional(),
      units: z.array(z.string()).optional(),
    }).optional(),
    layout: z.object({
      contentSize: z.string().optional(),
      wideSize: z.string().optional(),
    }).optional(),
    useRootPaddingAwareAlignments: z.boolean().optional(),
    blocks: z.record(z.string(), z.any()).optional(),
  }).optional(),
  styles: z.object({
    color: z.object({ background: z.string().optional(), text: z.string().optional() }).optional(),
    typography: z.object({
      fontFamily: z.string().optional(),
      fontSize: z.string().optional(),
      lineHeight: z.string().optional(),
    }).optional(),
    spacing: z.object({
      padding: z.record(z.string(), z.string()).optional(),
      margin: z.record(z.string(), z.string()).optional(),
      blockGap: z.string().optional(),
    }).optional(),
    elements: z.record(z.string(), z.any()).optional(),
    blocks: z.record(z.string(), z.any()).optional(),
  }).optional(),
  templateParts: z.array(z.object({
    name: z.string(),
    title: z.string(),
    area: z.enum(['header', 'footer', 'uncategorized']),
  })).optional(),
  customTemplates: z.array(z.object({
    name: z.string(),
    title: z.string(),
    postTypes: z.array(z.string()).optional(),
  })).optional(),
}).passthrough();

export const patternsResponseSchema = z.object({
  patterns: z.array(z.object({
    slug: z.string(),
    title: z.string(),
    categories: z.array(z.string()),
    content: z.string(),
  })),
  parts: z.array(z.object({
    slug: z.string(),
    content: z.string(),
  })),
});

export const templatesResponseSchema = z.object({
  templates: z.array(z.object({
    slug: z.string(),
    content: z.string(),
  })),
});
