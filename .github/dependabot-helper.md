# Notes for the Dependabot reviewer

Read by the shared reviewer of [Cerbrus/workflows](https://github.com/Cerbrus/workflows), which holds the instructions. This file only says what is specific to this repository.

## What the pull request's checks cover

The build workflow ran lint, the format check, the build, shellcheck on `deployment/*.sh` and the arm64 image build, without publishing. Nothing starts the container or requests a page, and there are no tests.

## Where updates can matter

- `Dockerfile`: the base image, and yarn 1 installed with npm because the Node image does not ship it.
- `src/build.mjs`: esbuild, sass and chokidar build the client bundle and the stylesheet.
- `package.json`: `typescript` is an alias for TypeScript 6, which typescript-eslint needs; `@typescript/native` is TypeScript 7 and provides `tsc`. Keep both as they are.
- `tsconfig.json` and `eslint.config.mjs`.

## Product behaviour to think of

- `/<status code>` answers for every code from 400 to 599 with that status; anything else answers with the 404 page.
- Every `*.cerbrus.nl` host shows these pages through the reverse proxy. `docs/proxy-contract.md` lists what it relies on: asset links as `href="/...` and `src="/...` with double quotes, port 3010, pages that need no query string.
- Express routing and static files, and Handlebars rendering of `src/views`.
- Code, title and puns reach the client as `data-` attributes on `#errorPage`.
- The client bundle (esbuild, IIFE, target `es2020`) and the compiled SCSS.
- The container: read-only file system, 64 MB of memory, arm64 on a Raspberry Pi, and the health check in the `Dockerfile`.

## Install and checks

Install with `yarn install --frozen-lockfile`; if the lock file is out of date, `yarn install`. Then run:

- `yarn lint`
- `yarn format:check`
- `yarn build`
- `yarn audit --groups dependencies` (report what it finds; a finding is not a failed check)

## Off limits

Do not touch `deployment/` or `docs/proxy-contract.md`.

## To try by hand

`https://error.cerbrus.nl/404`, and an error shown in place on another `cerbrus.nl` host.
