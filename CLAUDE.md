# Food Recipes

Simple Node.js recipe website using Express and Handlebars, with i18n support (English & Dutch).

## Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express 5
- **Templating:** Handlebars (via express-handlebars)
- **Styling:** SCSS (compiled via `sass`)
- **i18n:** i18next + handlebars-i18n (locales: `en`, `nl`)
- **Linting/Formatting:** ESLint + Prettier (configs in `.eslintrc.json`, `.prettierrc`)

## Project structure

```
src/
├── images/     # Source images
├── pages/      # Folder per page
│   └── shared/ # shared partials (header, footer, etc.)
├── scripts/    # Frontend scripts (loaded via <script> in templates)
├── server/     # Server-side scripts
│   └── app.ts  # Express entry point (port 3010), route registration
└── styles/     # SCSS source
deployment/     # Deployment shell scripts (add-site.sh, setup-pi.sh)
dist/           # Build output (gitignored)
```

## Commands

- `npm start` — Build and start the server
- `npm run build` — Compile TypeScript, SCSS, and copy views + images to `dist/`
- `npm run build:css` — Compile SCSS only
- `npm run build:copy` — Copy views and images to `dist/`

## Conventions

- All source code lives in `src/`; `dist/` is the build output
- Views live in `src/pages/`
- Images go in `src/images/`
