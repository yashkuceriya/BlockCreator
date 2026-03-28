# Architectural Decision Record

## 1. AI Provider: Anthropic Claude

**Decision**: Use Claude (claude-sonnet-4-20250514) via the Anthropic SDK.

**Why**: Claude produces more structurally consistent JSON and follows WordPress block markup constraints better than GPT-4o in testing. The Anthropic SDK handles auth, retries, and streaming natively.

**Alternatives considered**: OpenAI (GPT-4o) — produced more creative designs but had higher Custom HTML block violation rates. The `AIProvider` interface allows swapping providers without touching the orchestrator.

**Trade-off**: Vendor lock-in on a single provider. Mitigated by the provider abstraction layer.

## 2. Framework: Next.js App Router

**Decision**: Next.js 16 with App Router for both frontend and API.

**Why**: Single deployment artifact. API routes handle SSE streaming natively. React Server Components for the layout shell. The App Router's streaming response support maps directly to our SSE generation progress pattern.

**Alternatives considered**: Separate Express backend + Vite frontend — more flexible but doubles deployment complexity for no benefit in an MVP.

## 3. Prompt Strategy: 3-Stage Pipeline

**Decision**: Generate theme.json first, then patterns/parts, then templates — each as a separate AI call with the previous stage's output as context.

**Why**: A single prompt asking for the entire theme produces inconsistent results. Breaking it into stages lets each prompt be focused and lets us validate incrementally. If templates fail validation, we only retry templates — not the entire theme.

**Trade-off**: 3 API calls instead of 1 means higher latency (~30-60s total). But output quality and validation pass rates are dramatically better.

## 4. Validation: Hard Rejection + Retry with Correction

**Decision**: Parse all block markup with a custom parser, enforce an allowlist of core blocks, hard-reject `core/html`, and retry failed validations by sending errors back to the AI.

**Why**: The PRD's #1 constraint is zero Custom HTML blocks. A post-hoc find-and-replace approach would produce broken layouts. Instead, we reject and ask the AI to fix its own output with specific error context. This produces structurally valid corrections in 1-2 retries.

**Alternatives considered**:
- Strip `core/html` blocks automatically — breaks layout intent
- Use structured output / function calling — Anthropic's tool_use doesn't map well to the multi-file output format needed

## 5. Validation Schema: Zod

**Decision**: Zod v4 for runtime validation of AI-generated JSON.

**Why**: TypeScript-native, zero-dependency schema validation that produces human-readable error messages. These error messages are directly useful as correction prompts for the AI.

## 6. Preview: WordPress Playground

**Decision**: Embed WP Playground in an iframe for live theme preview.

**Why**: Shows the actual WordPress rendering of the generated theme — not a mockup. Users can see exactly what they'll get when they install the ZIP. Playground runs entirely in the browser via WebAssembly, no server needed.

**Trade-off**: Initial boot is slow (5-15s). Mitigated by lazy-loading — Playground only boots when a theme is actually generated, not on page load.

## 7. Security: Input Escaping in PHP Output

**Decision**: Escape all user-provided strings before interpolation into PHP/CSS comments and string literals.

**Why**: Theme name/description flow into `style.css` (CSS comment), `functions.php` (PHP comments + string literals), and pattern files (PHP comments). A theme name containing `*/` could break out of a CSS comment block. `escapeForComment()` and `escapeForPHPString()` prevent this.

## 8. Streaming: Server-Sent Events

**Decision**: Use SSE for real-time generation progress instead of WebSockets or polling.

**Why**: SSE is HTTP-native, works through proxies, and maps naturally to our unidirectional progress flow. The API route streams `data:` events as each generation step completes. The frontend parses these incrementally with proper buffer handling for partial chunks.

**Trade-off**: No bidirectional communication. If we needed to cancel from the server side, we'd need a different approach. Client-side cancellation is handled via AbortController.

## 9. File Structure: WordPress Block Theme Standards

**Decision**: Generate the exact file structure WordPress expects for a block theme.

```
theme-slug/
  style.css          # Theme metadata header
  theme.json         # Design system configuration
  functions.php      # Editor styles + pattern categories
  readme.txt         # WordPress.org readme format
  templates/         # index.html, page.html, single.html, etc.
  parts/             # header.html, footer.html
  patterns/          # hero.php, cta.php, etc. (PHP wrappers)
```

**Why**: The ZIP must be directly installable via Appearance > Themes > Add New without any post-processing.

## 10. Theme Iteration: Refinement via Previous Context

**Decision**: Allow users to iterate on generated themes by passing the previous theme.json back to the AI with a natural-language refinement instruction.

**Why**: First drafts are rarely final. The creative process is inherently iterative — "make it warmer", "bolder hero", "try serif fonts". Rather than forcing users to start from scratch each time, the refinement flow gives the AI context of what already exists, enabling targeted changes.

**Implementation**: `ThemePrompt` carries optional `refinementPrompt` and `previousThemeJson` fields. When present, the orchestrator uses `buildThemeJsonRefinementPrompt()` instead of the initial generation prompt. The AI is instructed to only change what the user asked for while preserving the rest of the design.

**Trade-off**: Full regeneration still occurs (patterns + templates are rebuilt from the refined theme.json). A more sophisticated approach would detect which layer changed and only regenerate affected files. Documented as a "What I'd Do Next" improvement.

## 11. Design Token Architecture: CSS Custom Properties Throughout

**Decision**: All generated theme content uses WordPress design tokens (`var(--wp--preset--color--primary)`, `var(--wp--preset--font-family--heading)`, etc.) rather than hardcoded values.

**Why**: This is how professional WordPress block themes work. It ensures the Site Editor's Global Styles panel can override any value, and style variations work correctly. It also means a single change in theme.json cascades to every pattern and template — the theme is truly "token-driven."

**Trade-off**: More complex AI prompts. The AI must understand the token naming convention and use it consistently. Mitigated by explicit instructions in every prompt with concrete examples.
