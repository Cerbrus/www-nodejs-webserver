# Cerbrus Webserver

Node.js web server behind `error.cerbrus.nl` (and `404.cerbrus.nl`): one interactive error page with animated wolf mascot, served per HTTP status code at `/<status code>` with that status. Anything else answers with the 404 page.

The reverse proxy also fetches these pages internally to show its own errors in place on other `*.cerbrus.nl` hosts, rewriting `href="/` and `src="/` to `https://error.cerbrus.nl/`. Keep asset links root-absolute in exactly that form. Read `docs/proxy-contract.md` before changing routes, asset paths, the port or how templates link assets: every `*.cerbrus.nl` host depends on it.

## Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express 5
- **Templating:** Handlebars (via express-handlebars)
- **Styling:** SCSS (compiled via `sass` in `build.mjs`)
- **Client bundling:** esbuild (IIFE bundles per page)
- **Linting/Formatting:** ESLint + Prettier (configs in `eslint.config.mjs`, `.prettierrc`)
- **Deployment:** container image `ghcr.io/cerbrus/webserver`, pulled by a timer on the Pi (see README)

## Project structure

```
src/
├── server/
│   ├── app.ts                # Express entry point (port 3010), Handlebars engine, routes
│   ├── errors.ts             # Title + subtitle per status code, plus the fallback for other codes
│   └── puns.ts               # Puns per kind of error (missing, access, server, request) + generic ones
├── scripts/                  # Client-side modules (bundled by esbuild via page entry points)
│   ├── index.ts              # Barrel export
│   ├── ui/                   # UI modules (clock, mascot, pong, paw-field, pun-ticker, home-button)
│   ├── debug/                # Console ASCII art module
│   └── helpers/              # DOM and array utilities, PageData (reads code, title, puns from the page)
├── views/
│   ├── layouts/
│   │   └── main.handlebars   # Shared HTML layout (head, body wrapper, asset links)
│   ├── shared/
│   │   └── mascot.handlebars # Wolf mascot SVG partial
│   └── pages/
│       ├── error.handlebars  # Error page template (all status codes)
│       ├── error.ts          # Client-side entry point (esbuild bundles this)
│       └── error.scss        # Page-specific SCSS
├── styles/                   # Shared SCSS
│   ├── shared.scss           # CSS variables, fonts, resets
│   ├── animations/           # Keyframe animations (UI + wolf)
│   └── modules/              # Per-module styles (clock, mascot, pong, etc.)
├── images/
│   └── favicon.svg
└── build.mjs                 # Bundles client TS (esbuild), compiles SCSS (sass), copies views + images
deployment/                   # docker-compose.yml, update.sh (timer on the Pi), install.sh, setup-pi.sh
Dockerfile                    # Image: build stage + runtime stage with production dependencies only
dist/                         # Build output (gitignored)
```

## Commands

- `yarn start` — Build and start the server
- `yarn build` — Compile server TS (`tsc`) + bundle client assets (`build.mjs`)
- `yarn dev` — Watch mode: rebuild on changes + run server with tsx
- `yarn lint` / `yarn format:check` — ESLint and Prettier, both run in CI

## Build output

```
dist/
├── server/
│   └── app.js                # Compiled Express server (tsc)
├── views/                    # Copied Handlebars templates
│   ├── layouts/
│   ├── shared/
│   └── pages/
└── public/                   # Static assets served by Express
    ├── pages/
    │   └── error/
    │       ├── index.js      # Bundled client JS (esbuild)
    │       └── index.css     # Compiled CSS (sass)
    └── images/
```

## Conventions

- All source code lives in `src/`; `dist/` is the build output
- Server code (`tsc`) and client code (`esbuild`) have separate build pipelines
- Each page in `src/views/pages/` has a `.handlebars` template, `.ts` entry point, and `.scss` styles co-located
- `build.mjs` picks up `.ts` entry points from `src/views/pages/`, bundles each with esbuild and compiles the `.scss` of the same name
- Shared styles and animations live in `src/styles/`
- Images go in `src/images/`
- The route only accepts three-digit codes from 400 to 599; never render a view named by the URL
- The server passes code, title and puns to the client as `data-` attributes on `#errorPage`; client modules read them through `PageData`
- Base class `BaseDomModule` calls `init()` from its constructor, before a subclass's field initializers run: assign such fields inside `init()`
