import player from "play-sound";

const p = player();

export function playAudio(path) {
  return new Promise((resolve, reject) => {
    p.play(path, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}