#!/usr/bin/env bash
# One-time setup of the error page server on a Raspberry Pi (64-bit Debian or Raspberry Pi OS).
# Usage: sudo bash install.sh
# Safe to run again.
set -euo pipefail

APP_DIR=/opt/webserver
REPO_RAW=https://raw.githubusercontent.com/Cerbrus/www-nodejs-webserver/master/deployment
CMDLINE=/boot/firmware/cmdline.txt

if [ "$(id -u)" -ne 0 ]; then
    echo "Run with sudo." >&2
    exit 1
fi

echo "==> Docker"
if ! command -v docker >/dev/null || ! docker compose version >/dev/null 2>&1; then
    apt-get update
    apt-get install -y ca-certificates curl
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
    # shellcheck disable=SC1091
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
        > /etc/apt/sources.list.d/docker.list
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
    echo "    already installed"
fi

echo "==> Memory limits"
REBOOT_NEEDED=0
if [ -f "$CMDLINE" ] && ! grep -q "cgroup_enable=memory" "$CMDLINE"; then
    cp -n "$CMDLINE" "$CMDLINE.bak-webserver"
    sed -i '1 s/$/ cgroup_enable=memory cgroup_memory=1/' "$CMDLINE"
    REBOOT_NEEDED=1
    echo "    kernel parameters added"
else
    echo "    already enabled"
fi

echo "==> $APP_DIR"
mkdir -p "$APP_DIR"
curl -fsSL -o "$APP_DIR/update.sh" "$REPO_RAW/update.sh"
chmod +x "$APP_DIR/update.sh"

echo "==> Update timer"
cat > /etc/systemd/system/webserver-update.service <<EOF
[Unit]
Description=Update the error page server container
After=network-online.target docker.service
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=$APP_DIR/update.sh
EOF

cat > /etc/systemd/system/webserver-update.timer <<EOF
[Unit]
Description=Check for error page server updates

[Timer]
OnBootSec=2min
OnUnitActiveSec=1min
RandomizedDelaySec=10

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now webserver-update.timer

echo "==> First update"
systemctl start webserver-update.service || echo "    first update failed: journalctl -u webserver-update"

echo "==> Done"
if [ "$REBOOT_NEEDED" -eq 1 ]; then
    echo "Reboot once to activate container memory limits."
fi
