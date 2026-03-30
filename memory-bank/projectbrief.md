# Project Brief

## What
AI-Powered WordPress Block Theme Generator — "The Editorial Engine"
Built for Automattic hiring challenge. Must get the job.

## Core Requirements (from Automattic PDF)
1. User inputs natural language description → AI generates complete WordPress Block Theme
2. **ZERO Custom HTML blocks** (core/html hard-rejected)
3. Valid theme.json, templates, patterns, parts — all standard core blocks only
4. ZIP download of installable theme
5. Live preview (WordPress Playground)
6. Clean code, tests, README, ADR, What I'd Do Next

## Tech Stack
- Next.js 16 (App Router, Turbopack, React Compiler)
- TypeScript strict mode
- Anthropic Claude (claude-sonnet-4-20250514) via @anthropic-ai/sdk
- OpenRouter as fallback provider
- Zod v4 for validation
- WordPress Playground (@wp-playground/client)
- JSZip for packaging
- Tailwind CSS v4
- Jest + ts-jest (98 tests, 9 suites)

## Repo
- GitHub: https://github.com/yashkuceriya/BlockCreator
- Local: /Users/yash/Downloads/Automattic/wp-block-theme-generator
