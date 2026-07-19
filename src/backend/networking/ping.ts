import { exec } from 'child_process';

export function pingHost(host: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(`ping -n 1 ${host}`, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}
