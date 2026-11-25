#!/usr/bin/env bash
# Raspberry Pi initial setup — updates the system, installs fan control and the login banner.
# Run once on a fresh Raspberry Pi OS Lite install.
# Usage: sudo bash setup-pi.sh
set -euo pipefail

echo "==> Updating system packages"
apt-get update && apt-get upgrade -y

echo "==> Setting up fan control (GPIO 14)"
FAN_SCRIPT="/usr/local/bin/fan-control.sh"
FAN_SERVICE="/etc/systemd/system/fan-control.service"

if [ -f "$FAN_SCRIPT" ]; then
    echo "    Replacing existing fan control script"
else
    echo "    Installing fan control script"
fi

cat > "$FAN_SCRIPT" << 'FANSCRIPT'
#!/usr/bin/env bash
# Fan control for GPIO 14 — keeps CPU temperature in a reasonable range.
set -euo pipefail

GPIO=14
ON_TEMP=45000   # millidegrees C
OFF_TEMP=30000
FAN_ON=0

pinctrl set "$GPIO" op dl

cleanup() {
    pinctrl set "$GPIO" dl
    exit 0
}
trap cleanup SIGTERM SIGINT

while true; do
    temp=$(cat /sys/class/thermal/thermal_zone0/temp)

    if [ "$temp" -ge "$ON_TEMP" ] && [ "$FAN_ON" -eq 0 ]; then
        pinctrl set "$GPIO" dh
        FAN_ON=1
    elif [ "$temp" -le "$OFF_TEMP" ] && [ "$FAN_ON" -eq 1 ]; then
        pinctrl set "$GPIO" dl
        FAN_ON=0
    fi

    sleep 5
done
FANSCRIPT
chmod +x "$FAN_SCRIPT"

cat > "$FAN_SERVICE" << 'UNIT'
[Unit]
Description=GPIO 14 CPU fan control
After=multi-user.target

[Service]
ExecStart=/usr/local/bin/fan-control.sh
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl unmask fan-control.service
systemctl enable --now fan-control.service
echo "Fan control service installed and started"

echo "==> Replacing MOTD"
cat > /etc/motd << 'MOTD'
 ____                                 ____  ___     ____          _
/ ___|  ___ _ ____   _____ _ __      |  _ \|_ _|   / ___|___ _ __| |__  _ __ _   _ ___
\___ \ / _ \ '__\ \ / / _ \ '__|____ | |_) || |   | |   / _ \ '__| '_ \| '__| | | / __|
 ___) |  __/ |   \ V /  __/ |  |____||  __/ | |   | |__|  __/ |  | |_) | |  | |_| \__ \
|____/ \___|_|    \_/ \___|_|        |_|   |___|   \____\___|_|  |_.__/|_|   \__,_|___/

MOTD

echo "==> Setup complete"
echo "Run install.sh to install the error page server."