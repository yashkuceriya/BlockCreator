# Tech Context

## Architecture
```
src/
├── app/
│   ├── api/generate/route.ts    # SSE endpoint (POST, streams progress)
│   ├── create/page.tsx           # Main app (3-panel: sidebar + form + preview)
│   ├── landing/page.tsx          # Marketing page (scroll animations, typing hero)
│   ├── globals.css               # Material 3 design tokens
│   └── layout.tsx                # Root layout with OG metadata
├── ai/
│   ├── orchestrator.ts           # 4-step pipeline: theme.json → patterns → templates → assemble
│   ├── provider.ts               # Factory: auto-selects Anthropic > OpenRouter
│   ├── providers/anthropic.ts    # Claude API with 120s timeout
│   ├── providers/openrouter.ts   # REST fallback with 120s timeout
│   ├── prompts/system.ts         # "ThemeArchitect" system prompt
│   ├── prompts/theme-json.ts     # theme.json gen + refinement + correction
│   ├── prompts/patterns.ts       # 5 patterns + 2 parts with reference example
│   ├── prompts/templates.ts      # 6 templates with reference example
│   └── schemas/theme-json.schema.ts  # Zod validation
├── components/
│   ├── ThemeForm.tsx             # Description + color presets + typography/layout dropdowns
│   ├── GenerationTerminal.tsx    # Dark terminal with timestamped logs
│   ├── PlaygroundPreview.tsx     # WP Playground iframe + file browser
│   ├── SuccessCard.tsx           # Download + iteration UI with suggestion chips
│   ├── Sidebar.tsx               # Light sidebar with blue gradient, project history
│   ├── Confetti.tsx              # Success celebration (50 particles)
│   ├── GenerationSkeleton.tsx    # Shimmer loading during generation
│   └── ui/button.tsx, badge.tsx, card.tsx
├── hooks/
│   ├── useThemeGeneration.ts     # SSE streaming, state machine, refine()
│   ├── usePlayground.ts          # Lazy WP Playground boot + theme mounting
│   └── useScrollReveal.ts        # IntersectionObserver for landing animations
├── validator/                    # Block parser + allowlist + nesting balance
├── assembler/                    # style.css, functions.php, file-mapper, ZIP
├── lib/
│   ├── constants.ts              # 100+ ALLOWED_BLOCKS, HARD_REJECTED_BLOCKS
│   ├── guardrails.ts             # Prompt injection (12 patterns), rate limiting, parseClientIp
│   ├── sanitize.ts               # sanitizePatternSlug, toPhpFunctionPrefix, escapeForPHP
│   ├── demo-theme.ts             # Pre-crafted "Aurora Studio" theme for instant demo
│   └── errors.ts, retry.ts
└── playground/mount-theme.ts     # Write files + activate + goTo('/')
```

## Design System (globals.css)
- Material Design 3 tokens
- Primary: #004b71, Container: #176491
- Tertiary/Gold: #cca72f
- Surfaces: #faf9f6 → #e9e8e5
- Inverse: #2f312f (dark terminals)
- Font: Newsreader (serif headlines), Inter/Geist Sans (body), Geist Mono

## Key Patterns
- SSE streaming for real-time generation progress
- Retry with error correction (AI self-corrects from validation errors)
- sanitizePatternSlug/toPhpFunctionPrefix for AI output safety
- Demo mode loads pre-crafted theme without API key
- Theme iteration: refinementPrompt + previousThemeJson passed through pipeline
- Provider selection wired from UI Settings → API route → createProvider()

## Production
- vercel.json: 300s maxDuration on /api/generate
- GitHub: https://github.com/yashkuceriya/BlockCreator
