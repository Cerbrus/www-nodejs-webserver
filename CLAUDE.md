# Cerbrus Webserver

Node.js web server featuring an interactive 404 "Pawge Not Found" error page with animated wolf mascot.

## Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express 5
- **Templating:** Handlebars (via express-handlebars)
- **Styling:** SCSS (compiled via esbuild + sass plugin)
- **Client bundling:** esbuild (IIFE bundles per page)
- **Linting/Formatting:** ESLint + Prettier (configs in `.eslintrc.json`, `.prettierrc`)

## Project structure

```
src/
├── server/
│   └── app.ts                # Express entry point (port 3010), Handlebars engine, routes
├── scripts/                  # Client-side modules (bundled by esbuild via page entry points)
│   ├── index.ts              # Barrel export
│   ├── ui/                   # UI modules (clock, mascot, pong, paw-field, pun-ticker)
│   ├── debug/                # Console ASCII art module
│   └── helpers/              # DOM and array utilities
├── views/
│   ├── layouts/
│   │   └── main.handlebars   # Shared HTML layout (head, body wrapper, asset links)
│   └── pages/
│       ├── 404.handlebars    # 404 page template
│       ├── 404.ts            # Client-side entry point (esbuild bundles this)
│       └── 404.scss          # Page-specific SCSS
├── styles/                   # Shared SCSS
│   ├── shared.scss           # CSS variables, fonts, resets
│   ├── animations/           # Keyframe animations (UI + wolf)
│   └── modules/              # Per-module styles (clock, mascot, pong, etc.)
├── images/
│   └── favicon.svg
└── build.mjs                 # esbuild config: bundles client TS+SCSS, copies views + images
scripts/                      # Deployment shell scripts (add-site.sh, setup-pi.sh)
dist/                         # Build output (gitignored)
```

## Commands

- `npm start` — Build and start the server
- `npm run build` — Compile server TS (`tsc`) + bundle client assets (`build.mjs`)
- `npm run dev` — Watch mode: rebuild on changes + run server with tsx

## Build output

```
dist/
├── server/
│   └── app.js                # Compiled Express server (tsc)
├── views/                    # Copied Handlebars templates
│   ├── layouts/
│   └── pages/
└── public/                   # Static assets served by Express
    ├── pages/
    │   └── 404/
    │       ├── index.js      # Bundled client JS (esbuild)
    │       └── index.css     # Bundled CSS (esbuild + sass)
    └── images/
```

## Conventions

- All source code lives in `src/`; `dist/` is the build output
- Server code (`tsc`) and client code (`esbuild`) have separate build pipelines
- Each page in `src/views/pages/` has a `.handlebars` template, `.ts` entry point, and `.scss` styles co-located
- esbuild picks up `.ts` entry points from `src/views/pages/` and bundles them with their SCSS imports
- Shared styles and animations live in `src/styles/`
- Images go in `src/images/`
