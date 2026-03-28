# The Editorial Engine — AI-Powered WordPress Block Theme Generator

An AI-powered web application that generates complete, production-quality WordPress Block Themes from natural language descriptions. Built with Next.js 16 and Claude AI — featuring robust block validation, real-time generation progress, live WordPress Playground preview, and theme iteration.

**Zero Custom HTML blocks, ever.** The `core/html` block is hard-rejected at the validation layer.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 3. Run development server
npm run dev

# 4. Open http://localhost:4173
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes* | — | Your Anthropic API key |
| `OPENROUTER_API_KEY` | No | — | OpenRouter API key (fallback provider) |
| `AI_PROVIDER` | No | `auto` | Provider selection: `auto`, `anthropic`, or `openrouter` |
| `ANTHROPIC_MODEL` | No | `claude-sonnet-4-20250514` | Override the Claude model |
| `OPENROUTER_MODEL` | No | `anthropic/claude-3.5-haiku` | Override the OpenRouter model |

\* Required unless using OpenRouter as the sole provider.

### Commands

```bash
npm run dev      # Start dev server (port 4173)
npm run build    # Production build
npm test         # Run all tests (78 tests)
npm run lint     # ESLint
```

## Key Features

### Core Workflow
- **Natural language input** — Describe your theme's vibe, audience, and purpose
- **Optional technical constraints** — Specify colors, typography, and layout preferences
- **4-step AI pipeline** — theme.json → patterns/parts → templates → ZIP assembly
- **Real-time progress** — Server-Sent Events streaming with live terminal display
- **Live WordPress preview** — Theme renders in WordPress Playground (in-browser WP)
- **ZIP download** — Production-ready theme installable on any WordPress 6.2+ site

### Theme Iteration (Bonus Feature)
After generating a theme, users can **refine** it with natural language instructions:
- "Make the color palette warmer"
- "Use a darker, more dramatic color scheme"
- "Make the hero section taller with more padding"
- "Switch to a more playful, rounded typography"

The AI receives the previous theme.json and applies targeted changes while preserving the rest of the design. This is accessible via the "Iterate" button on the success card with quick-suggestion chips.

### Design Quality
The AI prompt system is engineered to produce **visually striking, non-generic themes**:
- Curated color palettes based on color theory (not generic grays)
- Deliberate font pairing (expressive headings + readable body)
- Dramatic size contrast and generous whitespace
- Alternating section backgrounds for visual rhythm
- Rich, nested block patterns with contextually relevant content

### UI Polish
- **Scroll-reveal animations** — IntersectionObserver-driven fade/slide on all landing sections
- **Animated stats counters** — Numbers tick up as they enter viewport
- **Typing effect hero** — Cycles through taglines with typewriter animation
- **Confetti celebration** — Particle burst on successful generation
- **Shimmer loading skeleton** — Animated placeholder during generation
- **Frosted glass navigation** — Backdrop blur on scroll
- **6 diverse example prompts** — Blog, Portfolio, SaaS, Food Magazine, Tech Startup, Non-Profit

## Architecture

```
User Input ──> API Route ──> Orchestrator ──> AI Provider (Claude)
                  │              │                    │
                  │              ├── 1. theme.json ──> Zod + structural validation
                  │              ├── 2. patterns ────> Block markup validation
                  │              ├── 3. templates ──> Block markup validation
                  │              └── 4. assemble ───> ZIP package
                  │
                  ├── SSE stream (real-time progress) ──> Terminal UI
                  └── Result (files + ZIP) ──> Download + WP Playground preview
```

### Core Pipeline

The `ThemeOrchestrator` (`src/ai/orchestrator.ts`) runs a 4-step pipeline. Each step is validated before proceeding, with up to 2 retry attempts using error-correction prompts that feed validation errors back to the AI.

**Step 1: theme.json** — Design system generation (colors, typography, spacing, layout). Validated with Zod schema + structural checks. Supports refinement mode for iteration.

**Step 2: Patterns + Parts** — Header, footer, hero, CTA, features, about, testimonials. Each pattern's block markup is parsed and validated against the core block allowlist.

**Step 3: Templates** — index, home, single, page, archive, 404. References generated patterns and parts by slug. All block markup validated for proper nesting and JSON attributes.

**Step 4: Assembly** — Maps everything to WordPress file structure, generates `style.css`, `functions.php`, and `readme.txt`, wraps patterns in PHP headers, then packages as ZIP.

### Validation Layer

- **Block parser** (`src/validator/block-parser.ts`) — Regex-based parser that extracts WordPress block comments, validates JSON attributes, and checks nesting balance
- **Allowlist enforcement** — Only standard `core/*` blocks permitted (100+ blocks in allowlist)
- **Hard rejection** — `core/html` is rejected immediately and cannot be corrected past
- **Retry with correction** — On validation failure, errors are sent back to the AI as a correction prompt. The AI sees its previous output + specific errors and generates a fixed version

### Security

- **PHP comment injection prevention** — `escapeForComment()` sanitizes `*/` sequences
- **PHP string injection prevention** — `escapeForPHPString()` escapes `'` and `\`
- **Prompt injection defense** — 12 regex patterns detect jailbreak attempts
- **Content safety filtering** — Blocks harmful content generation
- **Input sanitization** — Length limits on all user inputs
- **Theme slug sanitization** — Only `[a-z0-9-]` characters allowed
- **Rate limiting** — 5 requests/minute/IP (in-memory)
- **AbortController** — In-flight requests properly cancelled on reset

### AI Provider Architecture

The provider interface (`src/types/ai-provider.ts`) defines a clean contract for AI backends. Two implementations are included:

- **Anthropic** (`src/ai/providers/anthropic.ts`) — Direct Claude API via `@anthropic-ai/sdk`. Primary provider.
- **OpenRouter** (`src/ai/providers/openrouter.ts`) — REST API wrapper. Cost-optimized fallback.

The factory function (`src/ai/provider.ts`) auto-selects the best available provider based on environment variables. Swapping providers requires zero code changes.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack, React Compiler) |
| Language | TypeScript (strict mode) |
| AI | Claude via `@anthropic-ai/sdk` + OpenRouter fallback |
| Validation | Zod v4 (runtime schema validation) |
| Preview | WordPress Playground (`@wp-playground/client`) |
| Packaging | JSZip |
| Styling | Tailwind CSS v4 with CSS custom properties |
| Testing | Jest + ts-jest |

## Testing

```bash
npm test
```

**9 test suites, 78 tests** covering:

| Suite | What it tests |
|-------|--------------|
| `api-route` | Input validation, SSE streaming, error responses, rate limiting |
| `orchestrator` | Full pipeline, progress callbacks, retry/correction |
| `validator` | Block parsing, allowlist, nesting, hard rejection |
| `prompts` | Prompt construction for all 3 generation stages |
| `assembler` | style.css, functions.php, file mapping, pattern PHP wrappers |
| `sanitize` | Name/slug sanitization, markdown fence stripping |
| `guardrails` | Injection detection, rate limiting, content safety |
| `edge-cases` | Prompt injection, unicode, deep nesting, retry logic |
| `integration` | End-to-end: prompt → theme.json → patterns → templates → ZIP |

## Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts    # SSE endpoint
│   ├── create/page.tsx           # Main application
│   ├── landing/page.tsx          # Marketing page
│   └── globals.css               # Design tokens + animations
├── ai/
│   ├── orchestrator.ts           # 4-step pipeline
│   ├── provider.ts               # Provider factory
│   ├── providers/                # Anthropic + OpenRouter
│   ├── prompts/                  # System, theme-json, patterns, templates
│   └── schemas/                  # Zod validation schemas
├── components/
│   ├── ThemeForm.tsx             # Input form + example prompts
│   ├── GenerationTerminal.tsx    # Real-time log display
│   ├── PlaygroundPreview.tsx     # WP Playground iframe + file browser
│   ├── SuccessCard.tsx           # Download + iteration UI
│   ├── Confetti.tsx              # Success celebration animation
│   └── ui/                       # Button, Badge, Card primitives
├── hooks/
│   ├── useThemeGeneration.ts     # Generation state + SSE streaming
│   ├── usePlayground.ts          # WP Playground lifecycle
│   └── useScrollReveal.ts        # Scroll animation hook
├── validator/                    # Block parser + validation engine
├── assembler/                    # File mapping + ZIP packaging
├── lib/                          # Constants, errors, guardrails, sanitization
└── playground/                   # Theme mounting in WP Playground
```

## Known Limitations

- **WP Playground boot time** — Initial load takes 5-15 seconds depending on network
- **Fixed pattern count** — Always generates 5 patterns + 2 parts; doesn't adapt to theme complexity
- **System fonts only** — theme.json references system font stacks; custom web fonts need asset pipeline
- **No image assets** — Themes use WordPress placeholder content; real images need media pipeline
- **Rate limiting** — In-memory only; production would need Redis or similar
