import { exec } from 'child_process';

export function playAudio(path) {
  return new Promise((resolve, reject) => {
    exec(`mpg123 "${path}"`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}