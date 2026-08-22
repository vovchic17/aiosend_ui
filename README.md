# aiosend UI

React + TypeScript interface for the Crypto Pay API.

## Structure

```text
src/
├── api/crypto-pay/          # API client, schemas, auth and errors
├── components/
│   ├── ui/                  # reusable design-system primitives
│   └── layout/              # application shell components
├── features/
│   ├── auth/                # authentication UI
│   └── dashboard/           # dashboard components, hooks and utilities
├── i18n/                    # dictionaries and language state
├── layouts/                 # route layouts
├── pages/                   # thin route-level composition
├── styles/                  # global styles and theme tokens
└── theme/                   # theme state and persistence
```

## Styling

Theme values live in `src/styles/theme.css` as CSS variables. `src/styles/globals.css`
exposes semantic Tailwind v4 tokens with `@theme inline`, so components use classes such
as `bg-surface`, `text-content-muted`, `border-subtle-border` and `bg-button` instead of
referencing raw CSS variables from JSX.

## Auth

Crypto Pay auth state is validated with Zod before restoration. Tokens are stored in
`sessionStorage` rather than long-lived `localStorage`; valid legacy state is migrated once.
Stored sessions are verified on startup and API `401/UNAUTHORIZED` responses clear auth
centrally.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run deploy
```

## Cloudflare Workers

The app is configured as a Cloudflare Workers Static Assets SPA. Wrangler runs the Vite build before deployment and uploads `dist`. Client-side routes fall back to `index.html`.

Authenticate once if needed:

```bash
npx wrangler login
```

Deploy:

```bash
npx wrangler deploy
```

The Worker name is `aiosend-ui`. Change `name` in `wrangler.jsonc` if you want a different Workers project name.
