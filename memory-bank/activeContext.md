# Active Context

## Current State
- All code committed and pushed to GitHub (38 commits)
- Build: clean, Tests: 98/98, Lint: 0 issues
- Stitch design system implemented (Material 3, editorial palette)
- AI config files (CLAUDE.md, AGENTS.md) removed, gitignored
- vercel.json added for production deployment

## What Was Just Done
1. Implemented Stitch design mockups into React components
2. Fixed WordPress Playground preview (theme wasn't activating properly)
3. Added color preset swatches + typography/layout dropdowns to form
4. Fixed hydration mismatch (navigator.userAgent SSR/client diff)
5. Hardened security: sanitizePatternSlug, toPhpFunctionPrefix, parseClientIp, rate limit memory cap
6. Added provider timeouts (120s), wired UI settings to backend
7. Fixed log timestamps (was showing render time, now shows arrival time)
8. Added concrete block markup examples to AI prompts
9. Pushed to GitHub

## What Needs Attention
- Landing page hasn't been updated to match Stitch HTML mockup yet (create page is done)
- Theme output quality depends on AI — prompts improved but untested with live API
- The demo theme (Aurora Studio) works without API key — key for reviewer experience
- Production deployment: just needs Vercel import + ANTHROPIC_API_KEY env var

## User Preferences
- NO AI trailers or Co-Authored-By in commits
- NO useless markdown files (CLAUDE.md, AGENTS.md removed)
- Wants Automattic-quality design (WordPress.com, Tumblr level)
- Speed is critical — context window running out
- Always use https://github.com/mrzacsmith/memory-bank for context persistence
