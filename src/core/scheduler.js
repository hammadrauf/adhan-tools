import schedule from "node-schedule";
import { playAudio } from "./player.js";

export function schedulePrayer(name, time, audioPath, soundCard, logger) {
  schedule.scheduleJob(time, async () => {
    logger(`Playing ${name} at ${time}`);

    if (audioPath) {
      try {
        await playAudio(audioPath, soundCard);
      } catch (err) {
        logger(`Error playing audio: ${err}`);
      }
    }
  });
}