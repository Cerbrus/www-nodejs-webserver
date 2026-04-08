# Food Recipes

A simple web server built with Node.js, Express, and Handlebars.

## Stack

- **Runtime:** Node.js (LTS) with TypeScript
- **Framework:** Express 5
- **Templating:** Handlebars (via express-handlebars)
- **Styling:** SCSS (compiled via `sass`)

## Getting started

```bash
npm install
npm start
```

The server starts at [http://localhost:3010](http://localhost:3010).

## Commands

| Command              | Description                                                  |
|----------------------|--------------------------------------------------------------|
| `npm start`          | Build and start the server                                   |
| `npm run build`      | Compile TypeScript, SCSS, and copy views + images to `dist/` |
| `npm run build:css`  | Compile SCSS only                                            |
| `npm run build:copy` | Copy views and images to `dist/`                             |

## Deployment

The app is deployed to a Raspberry Pi at `webhost.cerbrus.nl` via GitHub Actions on push to `master`.

### Raspberry Pi setup

The setup scripts can be fetched from [Cerbrus/www-nodejs-webserver](https://github.com/Cerbrus/www-nodejs-webserver).

**1. Initial setup** — run once on a fresh Raspberry Pi OS Lite install:

```bash
curl -fsSLO https://raw.githubusercontent.com/Cerbrus/www-nodejs-webserver/master/scripts/setup-pi.sh
sudo bash setup-pi.sh && rm setup-pi.sh
```

This updates the system, installs Node.js LTS, creates a `deploy` user for SSH-based deployments, and sets up a fan control service (GPIO 14) to keep the CPU cool.

**Fan control monitoring:**

```bash
# Check the fan control service status
systemctl status fan-control.service

# Watch CPU temperature and fan state (updates every 2s)
watch -n 2 'echo "Temp: $(($(cat /sys/class/thermal/thermal_zone0/temp) / 1000))°C | Fan: $(pinctrl get 14 | grep -q "hi" && echo ON || echo OFF)"'
```

After running, add your deploy public key so GitHub Actions can SSH in:

```bash
echo "<your-public-key>" | sudo tee /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
```

**2. Add a site** — run for each site you want to host:

```bash
curl -fsSLO https://raw.githubusercontent.com/Cerbrus/www-nodejs-recipes/master/deployment/add-site.sh
sudo bash add-site.sh <name> <port> [description] && rm add-site.sh
```

| Parameter     | Description                                                                        |
|---------------|------------------------------------------------------------------------------------|
| `name`        | Site name — used for the system user, `/opt/<name>` directory, and systemd service |
| `port`        | Port the app listens on                                                            |
| `description` | Optional service description (defaults to `<name> website`)                        |

For this project:

```bash
curl -fsSLO https://raw.githubusercontent.com/Cerbrus/www-nodejs-webserver/master/deployment/add-site.sh
sudo bash add-site.sh recipes 3010 "Simple Webserver" && rm add-site.sh
```

This creates the system user, app directory, systemd service, and grants the `deploy` user permission to restart the service.

### GitHub Actions

- **Build** (`build.yml`) — Runs on all branches to verify the project builds.
- **Deploy** (`deploy.yml`) — Runs on push to `master`, builds the project, rsyncs to the Pi, and restarts the service.

### Required secrets

| Secret           | Description                                               |
|------------------|-----------------------------------------------------------|
| `DEPLOY_SSH_KEY` | SSH private key for the `deploy` user on the Raspberry Pi |
| `DEPLOY_HOST`    | Hostname or IP address of the Raspberry Pi                |
