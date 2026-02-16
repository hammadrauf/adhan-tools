import schedule from "node-schedule";
import { playAudio } from "./player.js";

const scheduledJobs = [];

export function schedulePrayer(name, time, audioPath, soundCard, logger) {
  const job = schedule.scheduleJob(time, async () => {
    logger(`Playing ${name} at ${time}`);

    if (audioPath) {
      try {
        await playAudio(audioPath, soundCard);
      } catch (err) {
        logger(`Error playing audio: ${err}`);
      }
    }
  });
  scheduledJobs.push(job);
}

export function clearPrayers() {
  scheduledJobs.forEach(job => job.cancel());
  scheduledJobs.length = 0;
}