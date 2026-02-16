# Adhan-Tools
## Purpose

Adhan-Tools is a suite of utilities designed to automatically play the Adhan (Islamic call to prayer) at the prescribed times each day. These tools help Muslims observe their daily prayers by providing timely notifications and audio playback of the Adhan.

## Adhan-CLI Features

- **Automatic scheduling**: Plays Adhan at the five daily prayer times (Fajr, Dhuhr, Asr, Maghrib, and Isha)
- **Location-based**: Calculates prayer times based on geographic coordinates
- **Customizable audio**: Support for different Adhan recordings
- **Background operation**: Runs as a background service
- **Multiple notifications**: Visual and audio alerts

## Usage Examples

### Basic setup with location

```bash
adhan-cli --latitude 40.7128 --longitude -74.0060
```

### Specify custom Adhan file

```bash
adhan-cli --latitude 40.7128 --longitude -74.0060 --audio /path/to/adhan.mp3
```

### Run as background service

```bash
adhan-cli --latitude 40.7128 --longitude -74.0060 --daemon
```

### Check next prayer time

```bash
adhan-cli --next-prayer
```