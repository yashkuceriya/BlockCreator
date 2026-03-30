# System Patterns

## AI Pipeline
1. User submits ThemePrompt → POST /api/generate
2. SSE stream created → ThemeOrchestrator runs 4 steps
3. Each step: generate → validate (Zod + block parser) → retry with error context if failed (max 2)
4. Step 1: theme.json (supports refinement via previousThemeJson)
5. Step 2: patterns + template parts (5 patterns, 2 parts)
6. Step 3: templates (index, home, single, page, archive, 404)
7. Step 4: assemble files → package ZIP
8. Client receives files + base64 ZIP → shows preview + download

## Validation Chain
- Zod schema → structural check → block parser → allowlist → nesting balance
- wp:html = instant hard rejection, no retry
- Other errors → feed back to AI as correction prompt

## Security Layers
- sanitizePatternSlug(): AI slugs → ^[a-z0-9-]+$
- toPhpFunctionPrefix(): theme name → valid PHP identifier
- escapeForComment/PHPString(): prevent injection in generated PHP
- parseClientIp(): canonical IP from forwarded headers
- checkRateLimit(): 5/min per IP, 10K client cap, TTL cleanup
- checkPromptInjection(): 12 regex patterns for jailbreak
- checkContentSafety(): blocklist for harmful content
- Input length limits: name 100, description 2000, preferences 500

## Component Architecture
- create/page.tsx: orchestrates everything, manages state via useThemeGeneration hook
- Sidebar: project history (localStorage, max 10), settings, help
- ThemeForm: textarea + color presets + dropdowns, forwardRef for keyboard shortcut
- PlaygroundPreview: lazy-boots WP Playground, mounts theme, shows file browser
- GenerationTerminal: dark theme, timestamped logs, progress bar with stripe animation
- SuccessCard: stats grid + download + iteration UI with suggestion chips
