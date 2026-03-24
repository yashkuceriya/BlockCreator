# AI-Powered WordPress Block Theme Generator — Product Strategy

---

## 1. Product Vision

**Make block theme creation as natural as describing what you want.**

The WordPress Block Theme Generator closes the gap between what people can imagine and what they can build. It takes a plain-English description of a website and produces a real, editable, installable WordPress block theme — not a mockup, not a screenshot, but actual theme.json, templates, patterns, and style variations that work inside the WordPress Site Editor from minute one.

The product exists because block themes are the future of WordPress, but creating one still requires understanding theme.json's 400+ token surface, writing block markup by hand, and making dozens of interdependent design decisions before a single piece of content exists. We compress that from days to minutes while preserving full editorial control.

---

## 2. Automattic Pitch

WordPress powers 43% of the web, and block themes are its future — but adoption is bottlenecked by creation complexity. Our Block Theme Generator translates natural language into production-quality WordPress themes: real theme.json design tokens, real block templates, real patterns — validated, accessible, performant, and fully editable in the Site Editor. Unlike AI site builders that produce locked output, we generate open WordPress-native files that users own, extend, and customize. Every theme passes zero Custom HTML block enforcement, WCAG structure checks, and Core Web Vitals awareness. This isn't an AI gimmick bolted onto WordPress — it's the missing bridge between Gutenberg's power and the millions of users who need a faster path from idea to theme.

---

## 3. Core User Personas

### Luna — The Solo Creator
- Runs a food blog, has strong visual taste but no code skills
- Wants a theme that matches her brand aesthetic without hiring a developer
- Needs: speed, visual quality, easy editing after generation
- Pain: existing themes are "close but not quite" — she tweaks for hours

### Marcus — The Freelance Developer
- Builds 3-5 client sites per month on WordPress
- Needs a fast starting point that's architecturally clean, not a mess to maintain
- Wants: proper theme.json tokens, clean markup, no technical debt
- Pain: every project starts with the same 4 hours of boilerplate setup

### Priya — The Agency Technical Lead
- Manages a team building enterprise WordPress sites
- Needs: consistency across projects, brand system integration, accessibility compliance
- Wants: repeatable theme scaffolding with client-specific customization
- Pain: junior developers produce inconsistent theme architecture

### Sam — The Startup Founder
- Launching a SaaS product, needs a marketing site fast
- Doesn't know WordPress internals, just wants something that looks professional
- Wants: describe it, preview it, ship it — in one session
- Pain: the gap between Figma mockup and working WordPress site is weeks

---

## 4. Top User Flows

### Flow 1: First Theme Generation (3 minutes)
```
Describe theme → [optional] add brand colors/fonts → Generate →
Watch progress (theme.json → patterns → templates) →
Preview on desktop/tablet/mobile → Download ZIP → Install in WordPress
```

### Flow 2: Refine and Iterate (5 minutes)
```
See generated theme → Adjust description ("make the hero taller, add a testimonials section") →
Regenerate specific sections (not entire theme) → Preview diff → Export updated ZIP
```

### Flow 3: Load and Evolve a Saved Project (2 minutes)
```
Open Projects panel → Select previous theme → View preview →
Edit constraints (change color palette) → Regenerate with new constraints → Export
```

### Flow 4: Agency Client Handoff (10 minutes)
```
Create theme from client brief → Generate 3 style variations →
Present variations to client → Client picks one → Export with starter content →
Deploy to client's WordPress site
```

---

## 5. MVP vs V2 Feature Set

### MVP (What we've built)
- Natural language theme description
- Technical constraints (colors, typography, layout)
- AI-generated theme.json with full design token system
- Block template generation (index, page, single, archive, 404, home)
- Block pattern generation (hero, CTA, features, about, testimonials)
- Template parts (header, footer)
- Zero Custom HTML block enforcement with hard rejection
- Validation pipeline with retry/correction loop
- Live WordPress Playground preview
- ZIP download for direct installation
- Real-time generation progress with SSE streaming
- Project history (localStorage)
- Example prompts for quick start
- Theme summary with color palette visualization
- Human-friendly error messages
- Prompt injection defense and rate limiting
- AbortController for request cancellation
- 78 tests across 9 suites

### V2 (Next Phase)
- **Style variations** — Generate 3 alternative color/typography combinations from one brief
- **Section-level regeneration** — Regenerate just the hero or footer without touching the rest
- **Accessibility scoring** — WCAG contrast checks, heading hierarchy validation, landmark audit before export
- **Performance scoring** — Estimate CLS, LCP impact based on layout complexity
- **Screenshot-to-theme** — Upload a screenshot or URL, extract visual system, generate matching block theme
- **Brand asset upload** — Logo, favicon, brand colors extracted from uploaded images
- **WooCommerce templates** — Product archive, single product, cart, checkout templates
- **Starter content** — Generate placeholder content matched to the theme's industry
- **Chat-based refinement** — "Make the header stickier" / "Add a pricing table pattern" without full regeneration
- **Multi-theme workspace** — Manage multiple client themes in one interface
- **Figma import** — Extract design tokens from Figma files to seed theme.json
- **Explainable AI** — Show why specific layout/style decisions were made
- **Export to WordPress.com** — Direct deployment via WordPress.com REST API

---

## 6. Product Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │ThemeForm │ │Terminal  │ │PlaygroundPreview  │   │
│  │+Examples │ │+Progress │ │+FileTree          │   │
│  │+Constraints│+Timer   │ │+WP Playground     │   │
│  └────┬─────┘ └────┬────┘ └────────┬──────────┘   │
│       │             │               │               │
│  ┌────▼─────────────▼───────────────▼──────────┐   │
│  │        useThemeGeneration (hook)             │   │
│  │  SSE streaming, AbortController, state mgmt  │   │
│  └────────────────────┬────────────────────────┘   │
└───────────────────────┼─────────────────────────────┘
                        │ POST /api/generate (SSE)
┌───────────────────────▼─────────────────────────────┐
│                   API Layer                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │Input Guard- │  │Rate Limiter  │  │Sanitizer  │  │
│  │rails (inject│  │(5/min/IP)    │  │(length,   │  │
│  │ion detect)  │  │              │  │ escaping) │  │
│  └──────┬──────┘  └──────┬───────┘  └─────┬─────┘  │
│         └────────────────┼────────────────┘         │
│                          ▼                           │
│  ┌──────────────────────────────────────────────┐   │
│  │           ThemeOrchestrator                   │   │
│  │                                               │   │
│  │  Step 1: generateThemeJSON()                  │   │
│  │    → Zod schema validation                    │   │
│  │    → Structural validation                    │   │
│  │    → Retry with correction (up to 2x)         │   │
│  │                                               │   │
│  │  Step 2: generatePatterns()                   │   │
│  │    → Block markup parsing                     │   │
│  │    → Allowlist enforcement                    │   │
│  │    → core/html hard rejection                 │   │
│  │    → Retry with correction                    │   │
│  │                                               │   │
│  │  Step 3: generateTemplates()                  │   │
│  │    → Same validation pipeline                 │   │
│  │    → Template-part reference check            │   │
│  │    → Retry with correction                    │   │
│  │                                               │   │
│  │  Step 4: assembleThemeFiles()                 │   │
│  │    → style.css header generation              │   │
│  │    → functions.php generation                 │   │
│  │    → File mapping                             │   │
│  │    → ZIP packaging (JSZip)                    │   │
│  └──────────────────────┬───────────────────────┘   │
│                         │                            │
│  ┌──────────────────────▼───────────────────────┐   │
│  │          AI Provider Layer                    │   │
│  │  ┌─────────────┐  ┌──────────────────────┐   │   │
│  │  │  Anthropic   │  │  OpenRouter          │   │   │
│  │  │  (direct)    │  │  (cost-optimized)    │   │   │
│  │  └─────────────┘  └──────────────────────┘   │   │
│  │  Auto-selection: cheapest available           │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

---

## 7. UX/UI Screen Breakdown

### Screen 1: Home / Create
- Header: product name, keyboard shortcut hint, Start Over button
- Sidebar: Projects (saved themes), Settings (provider), Help (guide + shortcuts)
- Main panel: "Design Intent" textarea in a clean card, example prompt pills, "Technical Constraints" accordion (slug, colors, typography, layout), Generate button with loading state
- Right panel: Live Preview with traffic dots, file browser toggle, empty state with guidance

### Screen 2: Generating
- Step progress bar appears: Analyzing Intent → Generating theme.json → Building Templates → Packaging ZIP
- Terminal shows real-time logs with timestamps, colored step badges, elapsed timer
- Form panel auto-scrolls to show terminal
- Preview panel shows loading state

### Screen 3: Result
- Theme Summary card: color palette swatches (hover for hex), font names, template/pattern tags
- Success card: file count, size, "Download .zip" + "Retry/Refine" buttons
- Preview panel: live WordPress Playground rendering the theme, file browser for source inspection
- Terminal shows complete status

### Screen 4: Projects Panel (slide-out)
- List of saved themes with name, timestamp, file counts
- Click to reload any saved theme with full preview
- Delete button on hover
- Auto-saves on generation

### Screen 5: Settings Panel (slide-out)
- AI provider selector (Auto/Anthropic/OpenRouter)
- Clear project history

### Screen 6: Help Panel (slide-out)
- Step-by-step usage guide
- Keyboard shortcuts table
- Output format description

---

## 8. WordPress Theme File Structure

```
theme-slug/
├── style.css                    # Theme metadata header (WP required)
├── theme.json                   # Design system: colors, typography, spacing, layout
├── functions.php                # Editor styles, pattern category registration
├── readme.txt                   # WordPress.org format readme
├── templates/
│   ├── index.html               # Fallback template (WP required)
│   ├── home.html                # Blog homepage
│   ├── page.html                # Static pages
│   ├── single.html              # Single posts
│   ├── archive.html             # Category/tag/date archives
│   └── 404.html                 # Not found page
├── parts/
│   ├── header.html              # Site header (navigation, logo, tagline)
│   └── footer.html              # Site footer (copyright, links, social)
└── patterns/
    ├── hero.php                 # Hero/banner section
    ├── cta.php                  # Call-to-action section
    ├── features.php             # Feature grid/cards
    ├── about.php                # About/intro section
    └── testimonials.php         # Testimonial/review section
```

Every file uses exclusively WordPress block markup (`<!-- wp:block-name -->`) — zero Custom HTML blocks.

---

## 9. Theme Generation Pipeline

```
INPUT                    VALIDATION              OUTPUT
─────                    ──────────              ──────
User description    →    Guardrails check    →   Sanitized prompt
                         (injection, content)

Sanitized prompt    →    AI: theme.json      →   Zod schema validation
                                                  Structural validation
                                                  Retry if invalid (2x max)

theme.json context  →    AI: patterns/parts  →   Block parser extraction
                                                  Allowlist check (100+ core blocks)
                                                  core/html hard rejection
                                                  Nesting balance check
                                                  Retry if invalid

+ pattern slugs     →    AI: templates       →   Same block validation
+ part slugs                                      Template-part ref check
                                                  Retry if invalid

All validated files →    Assembly             →   style.css (escaped metadata)
                                                  functions.php (escaped strings)
                                                  Pattern PHP wrappers
                                                  readme.txt
                                                  ZIP packaging
```

Each AI call uses a focused prompt with the output of previous steps as context. The AI sees its own errors on retry and self-corrects.

---

## 10. Data Model / System Components

### Core Types
```typescript
ThemePrompt {
  name: string
  description: string
  colorPreferences?: string
  typographyPreferences?: string
  layoutPreferences?: string
}

ThemeJSON {
  version: 2 | 3
  settings: { color, typography, spacing, layout }
  styles: { color, typography, spacing, elements }
  templateParts: [{ name, title, area }]
  customTemplates: [{ name, title, postTypes }]
}

ThemeFiles {
  'style.css': string
  'theme.json': string
  'functions.php': string
  'readme.txt': string
  templates: Record<string, string>
  parts: Record<string, string>
  patterns: Record<string, string>
}

GenerationProgress {
  step: 'theme-json' | 'patterns' | 'templates' | 'assembling' | 'complete' | 'error'
  message: string
  progress: number (0-100)
  data?: unknown
}
```

### System Components
- **AIProvider** — Interface for swappable AI backends (Anthropic, OpenRouter)
- **ThemeOrchestrator** — Coordinates the 4-step pipeline with progress callbacks
- **BlockParser** — Regex-based WordPress block markup parser
- **Validator** — Allowlist enforcement, nesting checks, hard rejection
- **Assembler** — File generation with security escaping
- **Packager** — ZIP creation via JSZip
- **Guardrails** — Prompt injection detection, content safety, rate limiting

---

## 11. Competitive Differentiation

| Dimension | AI Site Builders (Wix/Squarespace) | Our Block Theme Generator |
|-----------|-------------------------------------|---------------------------|
| Output format | Proprietary, locked to platform | Open WordPress block theme files |
| Editing after generation | Limited to platform editor | Full WordPress Site Editor |
| Portability | Can't leave the platform | ZIP file, install anywhere |
| Code ownership | Platform owns the output | User owns every file |
| Extensibility | Plugin marketplace only | WordPress plugin/block ecosystem |
| Block compliance | N/A (not WordPress) | 100% core blocks, zero custom HTML |
| Validation | Opaque | Transparent: Zod schemas, block parser, allowlist |
| AI transparency | Black box | Explainable pipeline with real-time logs |

**Our angle**: We're the only tool that generates a real, portable, editable WordPress block theme from natural language — not a locked template, not a mockup, not a proprietary format. The output is what a skilled theme developer would build by hand, in minutes instead of days.

---

## 12. Risks and Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI generates invalid block markup | Theme won't install | Block parser + allowlist + retry correction loop |
| AI uses Custom HTML block | Violates core constraint | Hard rejection at parser level + system prompt enforcement |
| User injects malicious prompts | Security breach | 12-pattern injection detection + content safety checks |
| Theme name breaks PHP output | Code injection | escapeForComment() + escapeForPHPString() |
| AI produces generic/ugly themes | Low perceived quality | ThemeArchitect persona + detailed prompt engineering + style constraints |
| API costs spiral | Unsustainable | OpenRouter cost optimization + Haiku 4.5 default + rate limiting |
| WP Playground fails to load | No preview | Lazy boot + graceful fallback to file tree view |
| Single provider dependency | Service outage | Multi-provider architecture with auto-failover |

---

## 13. 30/60/90 Day Roadmap

### Days 1-30: Foundation + Polish
- [x] Core generation pipeline (theme.json → patterns → templates)
- [x] Validation with retry/correction
- [x] Live WP Playground preview
- [x] ZIP download
- [x] 78 tests across 9 suites
- [x] Security hardening (injection prevention, escaping, rate limiting)
- [x] Multi-provider support (Anthropic + OpenRouter)
- [x] Project history with localStorage
- [x] Documentation (README, ADR, What I'd Do Next)
- [ ] Deploy to Vercel with production env vars
- [ ] Generate 10 example themes as showcase

### Days 31-60: Quality + Iteration
- [ ] Style variations (3 alternatives from one brief)
- [ ] Section-level regeneration (just the hero, just the footer)
- [ ] Accessibility audit before export (heading hierarchy, landmarks, contrast)
- [ ] Performance scoring (layout complexity heuristics)
- [ ] Chat-based refinement ("make the hero taller")
- [ ] Brand asset upload (logo, colors extracted from image)
- [ ] WooCommerce template generation

### Days 61-90: Scale + Agency
- [ ] Screenshot-to-theme conversion
- [ ] Multi-theme workspace with team sharing
- [ ] Figma token import
- [ ] WordPress.com direct deployment
- [ ] Agency mode: save and reuse client theme templates
- [ ] Theme marketplace: publish generated themes
- [ ] Plugin hooks for extending the generation pipeline

---

## 14. Demo Scenario

**Setup**: Open the app in a browser. No installation, no accounts, no setup.

**Script** (90 seconds):

> "I'm going to create a complete WordPress block theme in under two minutes."

1. Type in the description box: *"A modern editorial theme for a tech magazine. Dark color scheme, strong typography with large headlines, featured article hero, category-based navigation, newsletter signup callout, and clean archive pages."*

2. Click **Generate Theme**. Point out:
   - The step progress bar advancing in real time
   - The generation log showing each AI decision with timestamps
   - The elapsed timer

3. When complete, show:
   - **Color palette swatches** extracted from theme.json
   - **Font names** chosen by the AI
   - **Template and pattern tags** — "6 templates, 5 patterns"
   - **File size** — ~40 KB

4. Switch to the **Live Preview** panel:
   - "This is running in a real WordPress instance in your browser via WordPress Playground"
   - Click through to show the blog homepage, a single post, and the 404 page

5. Switch to **Files** view:
   - Open theme.json — show the color palette, typography scale, spacing tokens
   - Open a pattern — show clean block markup, no Custom HTML

6. Click **Download .zip**:
   - "This ZIP installs directly into any WordPress site. Appearance → Themes → Add New."

7. Show **Projects panel**:
   - "Every theme auto-saves. Click to reload any previous generation."

8. Final beat:
   - "78 tests. Zero Custom HTML blocks. Prompt injection defense. Two AI providers with cost optimization. Built in a week."

---

## 15. Landing Page Copy

**Headline**:
> Describe your website. Get a real WordPress theme.

**Subheadline**:
> The Block Theme Generator turns plain English into production-ready WordPress block themes — with real templates, patterns, and design tokens. Not a mockup. Not a locked template. A real theme you own, edit, and extend.

---

## 16. Technical Build Plan (Challenger / Hackathon)

### Phase 1: Foundation (4-6 hours)
- Set up Next.js with TypeScript strict mode
- Define types: ThemePrompt, ThemeJSON, ThemeFiles, GenerationProgress
- Build the AI provider abstraction layer
- Implement Anthropic provider with system prompt
- Build Zod validation schemas for theme.json

### Phase 2: AI Pipeline (6-8 hours)
- Write focused prompts for theme.json, patterns, templates
- Build the ThemeOrchestrator with 3-step pipeline
- Implement block markup parser and allowlist validator
- Add retry-with-correction loop (feed errors back to AI)
- Hard-reject core/html at parser level

### Phase 3: Assembly + API (4-6 hours)
- Build file mapper (theme files to WordPress structure)
- Generate style.css, functions.php, readme.txt with proper escaping
- ZIP packaging with JSZip
- SSE streaming API route with real-time progress
- Input sanitization and guardrails

### Phase 4: Frontend (6-8 hours)
- ThemeForm with design intent + technical constraints
- GenerationTerminal with timestamps, step progress, elapsed timer
- PlaygroundPreview with WP Playground iframe (lazy boot)
- SuccessCard with file stats + download
- ThemeSummary with color swatches
- Project history sidebar
- Mobile responsive layout

### Phase 5: Quality + Docs (4-6 hours)
- Write tests: API route, orchestrator, validator, prompts, assembler, edge cases, integration, guardrails
- Add security: prompt injection detection, PHP escaping, rate limiting
- Add OpenRouter provider for cost optimization
- Write README, ADR, What I'd Do Next
- Organize git commits to tell the build story
- Deploy to Vercel

**Total: 24-34 hours of focused work.**
