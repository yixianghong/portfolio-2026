# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server at http://localhost:3000
pnpm build        # Build for production (Node.js server output, NOT for Firebase Hosting)
pnpm generate     # Static site generation for Firebase Hosting (produces .output/public with 200.html)
pnpm deploy       # Generate + deploy to Firebase Hosting
pnpm preview      # Preview production build
pnpm lint         # ESLint
pnpm typecheck    # Vue TSC type check
```

> **Firebase Hosting 部署請使用 `pnpm generate`（或 `pnpm deploy`），勿使用 `pnpm build`。**
> `nuxt build` 產生 Node.js 伺服器輸出，`.output/public` 不含 `200.html` SPA fallback，導致直接訪問路由出現 500 錯誤。

Package manager is **pnpm**. There are no tests.

## Architecture

**Nuxt 4** project using `@nuxt/ui` v4 and TailwindCSS v4.

### Directory layout

Nuxt 4 uses `app/` as the source root. All `pages/`, `components/`, `assets/`, etc. live under `app/`. The `~/` alias resolves to `app/`, not the project root.

### Rendering strategy

Configured in `nuxt.config.ts` via `routeRules`:

- `/` — prerendered (SSG)
- `/about`, `/contact` — `ssr: false` (client-side only)
- `/work`, `/work/**`, `/blog`, `/blog/**`, `/admin/**` — `ssr: false` (client-side only)

### Layouts

- `app/layouts/default.vue` — public site layout (header/footer)
- `app/layouts/admin.vue` — admin panel layout (sidebar with Posts/Works nav + logout)
- Admin pages declare `layout: 'admin'` and `middleware: 'auth'` in `definePageMeta`

### Firebase

Firebase is initialized via a **custom Nuxt plugin** (`app/plugins/firebase.client.ts`), not nuxt-vuefire. It calls `initializeApp` with config from `useRuntimeConfig().public.*` and provides `{ app, auth, db, storage }` via `$firebase`.

Auth state is tracked with `useState<User | null>('firebase-user')` synced by `onAuthStateChanged` inside the plugin.

**Access Firebase in composables via `useFirebase()`**, which destructures `$firebase` from `useNuxtApp()`.

In dev, `app/plugins/firebase-emulators.client.ts` auto-connects to local emulators (Firestore:8080, Auth:9099, Storage:9199). This is skipped in production (`import.meta.env.PROD`).

**Runtime config env vars** (prefix with `NUXT_PUBLIC_`):
- `NUXT_PUBLIC_FIREBASE_API_KEY`
- `NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NUXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NUXT_PUBLIC_FIREBASE_APP_ID`

### Composables

- `useFirebase()` — returns `{ db, auth, storage }` from plugin
- `useAuth()` — login/logout, exposes `user` (the `useState` ref) and `isAuthenticated`
- `usePosts()` — Firestore CRUD for `posts` collection; `fetchPosts(adminMode)` skips the `published` filter in admin mode
- `useWorks()` — Firestore CRUD + Firebase Storage upload for `works` collection

### Auth middleware

`app/middleware/auth.ts` — named middleware that waits for Firebase auth state via a `Promise`-wrapped `onAuthStateChanged`, then redirects unauthenticated users to `/admin/login`.

### Styling

TailwindCSS v4 — **no `tailwind.config.js`**. All customization is done in `app/assets/css/main.css` via the `@theme {}` directive.

### Icons

Icons use Iconify format via class names:
- `i-lucide-*` — Lucide icons
- `i-simple-icons-*` — Simple Icons

### ESLint

Configured with `@nuxt/eslint` stylistic rules: no trailing commas (`commaDangle: 'never'`), 1TBS brace style. `@typescript-eslint/no-explicit-any` is an error — use `unknown` or specific types.

### CI

GitHub Actions runs `pnpm lint` and `pnpm typecheck` on every push (Node 22).
