import { loadConfig } from "../config/loadConfig.js";
import { getPrayerTimes } from "../core/calculateTimes.js";
import { schedulePrayer } from "../core/scheduler.js";
import { playAudio } from "../core/player.js";
import fs from "fs";

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

playAudio('/usr/share/adhan/Bismillah.mp3', config.audio.soundCard).then(() => {
  logger("Startup sound played.");
}).catch((err) => {
  logger("Error playing startup sound: " + err);
});

const times = getPrayerTimes(config);

for (const [name, time] of Object.entries(times)) {
  const audio =
    name === "fajr" ? config.audio.fajr : config.audio.other;

  schedulePrayer(name, time, audio, config.audio.soundCard, logger);
}

logger("All prayers scheduled for today.");