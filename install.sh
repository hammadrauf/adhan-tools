#!/bin/bash

# Adhan Tools Installer
# This script installs the adhan-tools on a Linux system

set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root (use sudo)" 
   exit 1
fi

# Download Audio Files from Internet URLs, if not present in the audio directory
if [[ ! -f "audio/fajr.mp3" ]]; then
    echo "Downloading fajr.mp3..."
    wget -O audio/fajr.mp3 "https://media.assabile.com/assabile/adhan_3435370/31f4182515ea.mp3"
fi
if [[ ! -f "audio/adhan.mp3" ]]; then
    echo "Downloading adhan.mp3..."
    wget -O audio/adhan.mp3 "https://www.islamcan.com/audio/adhan/azan2.mp3"
fi
if [[ ! -f "audio/Bismillah.mp3" ]]; then
    echo "Downloading Bismillah.mp3..."
    wget -O audio/Bismillah.mp3 "https://www.andromendabay.ddns.net/Bismillah.mp3"
fi
if [[ ! -f "audio/chirping.mp3" ]]; then
    echo "Downloading chirping.mp3..."
    wget -O audio/chirping.mp3 "https://sounddino.com/index.php?r=load&mp3&id=74812&l=2"
fi

# Check for required files
if [[ ! -f "config.default.yml" ]]; then
    echo "Error: config.default.yml not found in $SCRIPT_DIR"
    exit 1
fi

if [[ ! -f "audio/fajr.mp3" || ! -f "audio/adhan.mp3" || ! -f "audio/Bismillah.mp3" || ! -f "audio/chirping.mp3" ]]; then
    echo "Error: Audio files not found in $SCRIPT_DIR/audio/"
    exit 1
fi

if [[ ! -f "bin/adhan-cli" || ! -f "bin/adhan-daemon" ]]; then
    echo "Error: Binary files not found in $SCRIPT_DIR/bin/"
    exit 1
fi

if [[ ! -f "systemd/adhan-daemon.service" || ! -f "systemd/adhan-daemon.timer" ]]; then
    echo "Error: Systemd files not found in $SCRIPT_DIR/systemd/"
    exit 1
fi

echo "Installing Adhan Tools..."

# Detect OS and install Audio Player
if command -v apt &> /dev/null; then
    echo "Detected Debian/Ubuntu system"
    apt update
    apt install -y mpg123 pulseaudio alsa-utils
elif command -v yum &> /dev/null; then
    echo "Detected RHEL/CentOS system"
    yum install -y mpg123 pulseaudio alsa-utils
elif command -v dnf &> /dev/null; then
    echo "Detected Fedora system"
    dnf install -y mpg123 pulseaudio alsa-utils
elif command -v pacman &> /dev/null; then
    echo "Detected Arch Linux system"
    pacman -Syu --noconfirm mpg123 pulseaudio alsa-utils
else
    echo "Unsupported package manager. Please install mpg123, pulseaudio, and alsa-utils manually."
    exit 1
fi

# Detect OS and install Node.js
if command -v apt &> /dev/null; then
    echo "Detected Debian/Ubuntu system"
    apt update
    apt install -y nodejs npm
elif command -v yum &> /dev/null; then
    echo "Detected RHEL/CentOS system"
    yum install -y nodejs npm
elif command -v dnf &> /dev/null; then
    echo "Detected Fedora system"
    dnf install -y nodejs npm
elif command -v pacman &> /dev/null; then
    echo "Detected Arch Linux system"
    pacman -Syu --noconfirm nodejs npm
else
    echo "Unsupported package manager. Please install Node.js manually."
    exit 1
fi

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Create necessary directories
echo "Creating directories..."
mkdir -p /etc/adhan
mkdir -p /usr/share/adhan
mkdir -p /usr/local/bin

# Copy configuration file
echo "Copying configuration file..."
cp config.default.yml /etc/adhan/config.yml

if [[ -n "$SUDO_USER" ]]; then
  USER_HOME=$(eval echo ~$SUDO_USER)
  sed -i "s|file: \"/var/log/adhan-daemon.log\"|file: \"$USER_HOME/adhan-daemon.log\"|" /etc/adhan/config.yml
fi

# Detect sound card
echo "Detecting sound card..."
SOUND_CARD=$(aplay -l 2>/dev/null | grep '^card' | head -1 | sed 's/card \([0-9]\+\):.*/\1/')
if [[ -n "$SOUND_CARD" ]]; then
  sed -i "s/soundCard: .*/soundCard: \"hw:$SOUND_CARD,0\"/" /etc/adhan/config.yml
  echo "Sound card detected: hw:$SOUND_CARD,0"
else
  # Fallback: check for audio hardware using lspci
  AUDIO_DEVICES=$(lspci -nnk | grep -A3 -i audio)
  AUDIO_COUNT=$(echo "$AUDIO_DEVICES" | grep -c "Audio device")
  if [[ $AUDIO_COUNT -gt 0 ]]; then
    echo "No ALSA card detected via aplay, but $AUDIO_COUNT audio device(s) found via lspci. Using default hw:0,0"
    echo "Audio devices detected:"
    echo "$AUDIO_DEVICES"
  else
    echo "No sound card or audio hardware detected."
  fi
fi

# Copy audio files
echo "Copying audio files..."
cp audio/fajr.mp3 /usr/share/adhan/
cp audio/adhan.mp3 /usr/share/adhan/
cp audio/Bismillah.mp3 /usr/share/adhan/
cp audio/chirping.mp3 /usr/share/adhan/

# Copy source files
echo "Copying source files..."
cp -r src /usr/share/adhan/

# Copy node_modules
echo "Copying node_modules..."
cp -r node_modules /usr/share/adhan/

# Install CLI and daemon binaries
echo "Installing binaries..."
cp bin/adhan-cli /usr/local/bin/
cp bin/adhan-daemon /usr/local/bin/
chmod +x /usr/local/bin/adhan-cli
chmod +x /usr/local/bin/adhan-daemon

# Install systemd service and timer
echo "Installing systemd service and timer..."
cp systemd/adhan-daemon.service /etc/systemd/system/
if [[ -n "$SUDO_USER" ]]; then
  sed -i "s/User=root/User=$SUDO_USER/" /etc/systemd/system/adhan-daemon.service
  sed -i "s/Group=root/Group=$SUDO_USER/" /etc/systemd/system/adhan-daemon.service
fi
cp systemd/adhan-daemon.timer /etc/systemd/system/

# Reload systemd daemon
systemctl daemon-reload

# Enable and start the timer
echo "Enabling and starting adhan-daemon service..."
systemctl enable adhan-daemon.service
systemctl start adhan-daemon.service

# Enable and start the timer
echo "Enabling and starting adhan-daemon timer..."
systemctl enable adhan-daemon.timer
systemctl start adhan-daemon.timer

# Add user to audio group for ALSA access
if [[ -n "$SUDO_USER" ]]; then
  usermod -a -G audio "$SUDO_USER"
  echo "Added $SUDO_USER to audio group for ALSA access."
  echo "You may need to log out and log back in for the group change to take effect."
else
  echo "Please ensure your user is in the 'audio' group to access sound devices without sudo."
fi

echo "Installation completed successfully!"
echo "You can now use 'adhan-cli' command."
echo "The daemon is running and will play adhan at prayer times."