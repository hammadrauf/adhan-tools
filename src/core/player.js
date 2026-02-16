import { exec } from 'child_process';

export function playAudio(path, soundCard = 'default') {
  return new Promise((resolve, reject) => {
    const cmd = soundCard !== 'default' ? `mpg123 -o alsa -a "${soundCard}" "${path}"` : `mpg123 "${path}"`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}