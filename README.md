# Adhan-Tools
## Purpose

Adhan-Tools is a suite of utilities designed to automatically play the Adhan (Islamic call to prayer) at the prescribed times each day. These tools help Muslims observe their daily prayers by providing timely notifications and audio playback of the Adhan.

## Adhan-CLI Features

- **Automatic scheduling**: Plays Adhan at the five daily prayer times (Fajr, Dhuhr, Asr, Maghrib, and Isha)
- **Location-based**: Calculates prayer times based on geographic coordinates
- **Customizable audio**: Support for different Adhan recordings
- **Background operation**: Runs as a background service
- **Multiple notifications**: Visual and audio alerts

## Basic Upstream Dependency
This softwre is haevily dependant on [Adhanjs](https://github.com/batoulapps/adhan-js). More details about its parameters, and hence this software config file parameters can be found at [Parameters Guide](https://github.com/batoulapps/adhan-js/blob/master/METHODS.md).

    - [https://github.com/batoulapps/adhan-js](https://github.com/batoulapps/adhan-js)
    - [https://github.com/batoulapps/adhan-js/blob/master/METHODS.md](https://github.com/batoulapps/adhan-js/blob/master/METHODS.md)

## Usage Examples

### Basic setup with location

```bash
#adhan-cli --latitude 40.7128 --longitude -74.0060
sudo ./install.sh
sudo ./uninstall.sh
```

### Specify custom Adhan file

```bash
#adhan-cli --latitude 40.7128 --longitude -74.0060 --audio /path/to/adhan.mp3
Either Edit - `/etc/adhan/config.yml`
Or Change the MP3 files at - `/usr/share/adhan/`
```

### Specify custom Adhan Calculations

```bash
#adhan-cli --latitude 40.7128 --longitude -74.0060 --audio /path/to/adhan.mp3
Edit - `/etc/adhan/config.yml`
```


### Run as background service

```bash
##adhan-cli --latitude 40.7128 --longitude -74.0060 --daemon
sudo systemctl enable adhan-daemon.service --now
sudo systemctl enable adhan-daemon.timer --now
```

### Check next prayer time

```bash
adhan-cli --next
```