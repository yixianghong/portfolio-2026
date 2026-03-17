# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server at http://localhost:3000
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # ESLint
pnpm typecheck    # Vue TSC type check
```

Package manager is **pnpm**. There are no tests.

## Architecture

**Nuxt 4** project using `@nuxt/ui` v4 and TailwindCSS v4.

### Directory layout

Nuxt 4 uses `app/` as the source root. All `pages/`, `components/`, `assets/`, etc. live under `app/`. The `~/` alias resolves to `app/`, not the project root.

- `app/app.vue` — root layout (header, main, footer via Nuxt UI components)
- `app/app.config.ts` — Nuxt UI theme colors (`primary: 'green'`, `neutral: 'slate'`)
- `app/assets/css/main.css` — TailwindCSS entry point and custom `@theme` variables
- `app/pages/index.vue` — homepage, prerendered (SSG)

### Styling

TailwindCSS v4 — **no `tailwind.config.js`**. All customization (colors, fonts, breakpoints, animations) is done in `app/assets/css/main.css` via the `@theme {}` directive.

```css
/* Add custom tokens here */
@theme {
  --color-primary-500: oklch(...);
  --font-sans: 'Inter', ...;
}
```

### Icons

Icons use Iconify format via class names:
- `i-lucide-*` — Lucide icons (`@iconify-json/lucide`)
- `i-simple-icons-*` — Simple Icons (`@iconify-json/simple-icons`)

### ESLint

Configured with `@nuxt/eslint` stylistic rules: no trailing commas (`commaDangle: 'never'`), 1TBS brace style.

### CI

GitHub Actions runs `pnpm lint` and `pnpm typecheck` on every push (Node 22).
