import { loadConfig } from "../config/loadConfig.js";
import { getPrayerTimes } from "../core/calculateTimes.js";
import { schedulePrayer, clearPrayers } from "../core/scheduler.js";  // Assume clearPrayers is added to scheduler.js
import { playAudio } from "../core/player.js";
import fs from "fs";
import schedule from "node-schedule";  // Add this import

const configPath = process.argv[2] || "/etc/adhan/config.yml";
const config = loadConfig(configPath);

function logger(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  if (config.logging?.file) {
    fs.appendFileSync(config.logging.file, line);
  } else {
    console.log(line);
  }
}

logger("Adhan daemon starting…");

// Delay startup sound to allow audio device to initialize
setTimeout(() => {
  playAudio('/usr/share/adhan/Bismillah.mp3', config.audio.soundCard).then(() => {
    logger("Startup sound played.");
  }).catch((err) => {
    logger("Error playing startup sound: " + err);
  });
}, 3000); // 3 second delay

// Function to calculate and schedule prayers
function calculateAndSchedule() {
  logger("Recalculating prayer times and scheduling...");
  clearPrayers();  // Clear existing schedules to avoid duplicates
  const times = getPrayerTimes(config);
  for (const [name, time] of Object.entries(times)) {
    let audio;
    switch (name) {
      case "fajr":
        audio = config.audio.fajr;
        break;
      case "sunrise":
        audio = config.audio.chirping;
        break;
      default:
        audio = config.audio.other;
        break;
    }
    schedulePrayer(name, time, audio, config.audio.soundCard, logger);
  }
  logger("Prayers scheduled.");
}

// Schedule the calculation job using the cron string from config
const cronJob = schedule.scheduleJob(config.calculation.schedule, calculateAndSchedule);

// Run initial calculation on startup
calculateAndSchedule();

logger("Daemon is running and will recalculate at scheduled times.");
// Keep the process alive (long-running)
process.on('SIGINT', () => {
  logger("Shutting down daemon...");
  cronJob.cancel();
  process.exit(0);
});