#!/bin/bash

# Adhan Tools Uninstaller
# This script uninstalls the adhan-tools from a Linux system

set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root (use sudo)"
   exit 1
fi

echo "Uninstalling Adhan Tools..."

# Stop and disable systemd timer and service
echo "Stopping and disabling adhan-daemon timer..."
systemctl stop adhan-daemon.timer || true
systemctl disable adhan-daemon.timer || true

echo "Stopping and disabling adhan-daemon service..."
systemctl stop adhan-daemon.service || true
systemctl disable adhan-daemon.service || true

# Remove systemd files
echo "Removing systemd files..."
rm -f /etc/systemd/system/adhan-daemon.service
rm -f /etc/systemd/system/adhan-daemon.timer

# Reload systemd daemon
systemctl daemon-reload

# Remove binaries
echo "Removing binaries..."
rm -f /usr/local/bin/adhan-cli
rm -f /usr/local/bin/adhan-daemon

# Remove installed files and directories
echo "Removing installed files and directories..."
rm -rf /usr/share/adhan
rm -rf /etc/adhan

# Remove user from audio group
if [[ -n "$SUDO_USER" ]]; then
  gpasswd -d "$SUDO_USER" audio || true
  echo "Removed $SUDO_USER from audio group."
fi

echo "Uninstallation completed successfully!"
echo "Note: System packages (mpg123, pulseaudio, alsa-utils, nodejs, npm) were not removed as they may be used by other applications."
echo "If you want to remove them, do so manually with your package manager."