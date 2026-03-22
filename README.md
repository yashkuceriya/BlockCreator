# WP Block Theme Generator

An AI-powered web application that generates complete, valid WordPress Block Themes from natural language descriptions. Built with Next.js and Claude (Anthropic) — featuring robust validation, real-time generation progress, and live WordPress Playground preview.

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
| `ANTHROPIC_API_KEY` | Yes | — | Your Anthropic API key |
| `ANTHROPIC_MODEL` | No | `claude-sonnet-4-20250514` | Override the Claude model |
| `AI_PROVIDER` | No | `anthropic` | AI provider selection |

### Commands

```bash
npm run dev      # Start dev server (port 4173)
npm run build    # Production build
npm test         # Run all tests (65 tests)
npm run lint     # ESLint
```

## Architecture

```
User Input ──> API Route ──> Orchestrator ──> AI Provider (Claude)
                  |              |                    |
                  |              |-- 1. Generate theme.json --> Zod + structural validation
                  |              |-- 2. Generate patterns/parts --> Block markup validation
                  |              |-- 3. Generate templates --> Block markup validation
                  |              +-- 4. Assemble files --> Package as ZIP
                  |
                  |-- SSE stream (real-time progress) --> Frontend terminal
                  +-- Final result (files + ZIP) --> Download + WP Playground preview
```

### Core Pipeline

The `ThemeOrchestrator` (`src/ai/orchestrator.ts`) runs a 4-step pipeline. Each step is validated before proceeding to the next, with up to 2 retry attempts using error-correction prompts.

**Step 1: theme.json** — Design system generation (colors, typography, spacing, layout). Validated with Zod schema + structural checks.

**Step 2: Patterns + Parts** — Header, footer, hero, CTA, features, about, testimonials. Each pattern's block markup is parsed and validated against the allowlist.

**Step 3: Templates** — index, home, single, page, archive, 404. References generated patterns and parts by slug. Block markup validated.

**Step 4: Assembly** — Maps everything to WordPress file structure (style.css, theme.json, functions.php, readme.txt, templates/, parts/, patterns/), then packages as ZIP.

### Validation Layer (`src/validator/`)

- **Block parser** — Regex-based parser that extracts WordPress block comments, validates JSON attributes, and checks nesting balance
- **Allowlist enforcement** — Only standard `core/*` blocks are permitted (100+ blocks in allowlist)
- **Hard rejection** — `core/html` is rejected immediately and cannot be corrected past
- **Retry with correction** — On validation failure, errors are sent back to the AI as a correction prompt. The AI sees its previous output + specific errors and generates a fixed version

### Assembly (`src/assembler/`)

- `style-css.ts` — WordPress theme header with metadata (comment-injection-safe)
- `functions-php.ts` — Editor styles + pattern category registration (string-injection-safe)
- `file-mapper.ts` — Maps generated content to file structure with PHP pattern wrappers
- `packager.ts` — Creates ZIP archive via JSZip

### Security

- **PHP comment injection prevention** — `escapeForComment()` sanitizes `*/` sequences in theme names/descriptions before interpolation into CSS/PHP comments
- **PHP string injection prevention** — `escapeForPHPString()` escapes `'` and `\` in text domains
- **Input sanitization** — Length limits on all user inputs (name: 100, description: 2000, preferences: 500)
- **Theme slug sanitization** — Only `[a-z0-9-]` characters allowed, preventing path traversal
- **AbortController** — In-flight SSE requests are properly cancelled on reset

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `ThemeForm` | Design intent textarea + technical constraints accordion |
| `GenerationTerminal` | Real-time SSE log with timestamps, step progress bar, elapsed timer |
| `PlaygroundPreview` | Live WordPress preview via WP Playground (lazy-booted on first generation) |
| `SuccessCard` | Download card with file count, template count, pattern count, size |
| `ErrorDisplay` | Human-friendly error messages (parses raw API errors into actionable text) |

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **AI**: Anthropic Claude via `@anthropic-ai/sdk`
- **Validation**: Zod v4 (runtime schema validation)
- **Preview**: WordPress Playground (`@wp-playground/client`)
- **Packaging**: JSZip
- **Styling**: Tailwind CSS v4
- **Testing**: Jest + ts-jest

## Testing

```bash
npm test
```

**8 test suites, 65 tests** covering:

| Suite | What it tests |
|-------|--------------|
| `api-route` | Input validation, SSE streaming, error responses |
| `orchestrator` | Full pipeline, progress callbacks, retry/correction |
| `validator` | Block parsing, allowlist, nesting, hard rejection |
| `prompts` | Prompt construction for all 3 generation stages |
| `assembler` | style.css, functions.php, file mapping, pattern PHP wrappers |
| `sanitize` | Name/slug sanitization, markdown fence stripping |
| `edge-cases` | Prompt injection, unicode, deep nesting, retry logic |
| `integration` | End-to-end: prompt -> theme.json -> patterns -> templates -> ZIP |

## Known Limitations

- **WP Playground boot time** — Initial load takes 5-15 seconds depending on network
- **Fixed pattern count** — Always generates 5 patterns + 2 parts; doesn't adapt to theme complexity
- **System fonts only** — theme.json references system font stacks; custom web fonts would need asset pipeline
- **Single AI provider** — Only Anthropic implemented; OpenAI provider is stubbed with interface
- **No image assets** — Themes use WordPress placeholder content; real images need media pipeline
- **No multi-theme session** — Each generation replaces the previous result
