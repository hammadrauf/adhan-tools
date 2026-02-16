import { loadConfig } from "../config/loadConfig.js";
import { getPrayerTimes } from "../core/calculateTimes.js";

function printHelp() {
  console.log(`
Usage: adhan-cli [config-path] [options]

Options:
  --help       Show this help message
  --next       Show the next prayer time
  --tomorrow   Show prayer times for tomorrow
  --week       Show prayer times for the current week

If no options are provided, shows today's prayer times.
Config path defaults to /etc/adhan/config.yml if not specified.
`);
}

function getNextPrayer(times, config, now = new Date()) {
  const prayers = [
    { name: 'fajr', time: times.fajr },
    { name: 'sunrise', time: times.sunrise },
    { name: 'dhuhr', time: times.dhuhr },
    { name: 'asr', time: times.asr },
    { name: 'maghrib', time: times.maghrib },
    { name: 'isha', time: times.isha }
  ];

  for (const prayer of prayers) {
    if (prayer.time > now) {
      return prayer;
    }
  }
  // If all prayers have passed, return fajr of next day
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = getPrayerTimes(config, tomorrow);
  return { name: 'fajr', time: tomorrowTimes.fajr };
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Parse arguments
const args = process.argv.slice(2);
let configPath = "/etc/adhan/config.yml";
let command = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--')) {
    switch (arg) {
      case '--help':
        printHelp();
        process.exit(0);
      case '--next':
        command = 'next';
        break;
      case '--tomorrow':
        command = 'tomorrow';
        break;
      case '--week':
        command = 'week';
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        printHelp();
        process.exit(1);
    }
  } else {
    // Assume it's the config path
    configPath = arg;
  }
}

const config = loadConfig(configPath);

if (command === 'next') {
  const times = getPrayerTimes(config);
  const next = getNextPrayer(times, config);
  console.log(`Next prayer: ${next.name} at ${formatTime(next.time)}`);
} else if (command === 'tomorrow') {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const times = getPrayerTimes(config, tomorrow);
  console.log(`Prayer Times for ${formatDate(tomorrow)}:`);
  for (const [name, time] of Object.entries(times)) {
    console.log(`${name}: ${formatTime(time)}`);
  }
} else if (command === 'week') {
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const times = getPrayerTimes(config, date);
    console.log(`\n${formatDate(date)}:`);
    for (const [name, time] of Object.entries(times)) {
      console.log(`${name}: ${formatTime(time)}`);
    }
  }
} else {
  // Default: today's times
  const times = getPrayerTimes(config);
  console.log("Prayer Times:");
  for (const [name, time] of Object.entries(times)) {
    console.log(`${name}: ${formatTime(time)}`);
  }
}