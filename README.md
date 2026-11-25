# Webserver

The error page server behind `error.cerbrus.nl`, built with Node.js, Express, and Handlebars.

## Routes

| Path             | Answer                                                                         |
|------------------|--------------------------------------------------------------------------------|
| `/<status code>` | The error page for that HTTP status code (400 to 599), with that status        |
| anything else    | The 404 page, with status 404                                                  |

Status codes with their own title and text are listed in `src/server/errors.ts`; other codes get a generic page. The puns in the ticker and the browser console follow the kind of error (`src/server/puns.ts`).

The reverse proxy also fetches these pages internally, to show its own errors in place on other hosts. It rewrites `href="/` and `src="/` to `https://error.cerbrus.nl/`, so asset links in the templates have to stay root-absolute. The button below the page adapts: shown in place it offers the site's home page or a retry, on `error.cerbrus.nl` itself it goes back.

## Stack

- **Runtime:** Node.js (LTS) with TypeScript
- **Framework:** Express 5
- **Templating:** Handlebars (via express-handlebars)
- **Styling:** SCSS (compiled via `sass`)

## Getting started

```bash
yarn install
yarn start
```

The server starts at [http://localhost:3010](http://localhost:3010); set `PORT` for another port.

## Commands

| Command             | Description                                                  |
|---------------------|--------------------------------------------------------------|
| `yarn start`        | Build and start the server                                   |
| `yarn build`        | Compile TypeScript, SCSS, and copy views + images to `dist/` |
| `yarn dev`          | Watch mode: rebuild on changes and run the server with `tsx` |
| `yarn lint`         | Run ESLint                                                   |
| `yarn format`       | Format with Prettier                                         |
| `yarn format:check` | Check the formatting                                         |

## Deployment

1. A push to `master` makes GitHub Actions (`.github/workflows/build.yml`) lint, build and publish the image `ghcr.io/cerbrus/webserver` for `linux/arm64`, tagged `latest` and with the commit hash. Pushes to `develop` and pull requests build without publishing.
2. A systemd timer on the Raspberry Pi runs `deployment/update.sh` every minute. It fetches the current `docker-compose.yml` and its own newer version, compares the image on the Pi with the registry's, and pulls and restarts only when something changed.

Nothing connects to the Pi from outside: no SSH access, no deploy key, no secrets.

### On the Pi

```
/opt/webserver/
|-- docker-compose.yml    # fetched from the repo by the updater
|-- update.sh             # fetched from the repo, replaces itself
`-- .env                  # optional: IMAGE_TAG=<commit hash> pins a version
```

The container listens on port 3010 with a memory limit of 64 MB and a read-only file system. A reverse proxy serves it as `error.cerbrus.nl` and `404.cerbrus.nl`.

### Install

On a Raspberry Pi with 64-bit Debian or Raspberry Pi OS:

```bash
curl -fsSLO https://raw.githubusercontent.com/Cerbrus/www-nodejs-webserver/master/deployment/install.sh
sudo bash install.sh && rm install.sh
```

This installs Docker when it is missing, turns on container memory limits (one reboot), and installs and starts `webserver-update.timer`.

`deployment/setup-pi.sh` is the general first setup of a fresh Pi (system update, fan control on GPIO 14, login banner) and has nothing to do with this app.

### Check, roll back

- **Check:** `systemctl list-timers webserver-update.timer`, `journalctl -u webserver-update`, `sudo docker compose ps` in `/opt/webserver`, `curl -i http://127.0.0.1:3010/404`.
- **Roll back:** put `IMAGE_TAG=<commit hash>` in `/opt/webserver/.env`; the updater follows within a minute. Remove the line to return to `latest`.

### Fan control monitoring

```bash
# Check the fan control service status
systemctl status fan-control.service

# Watch CPU temperature and fan state (updates every 2s)
watch -n 2 'echo "Temp: $(($(cat /sys/class/thermal/thermal_zone0/temp) / 1000))°C | Fan: $(pinctrl get 14 | grep -q "hi" && echo ON || echo OFF)"'
```
