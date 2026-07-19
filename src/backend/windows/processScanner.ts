import { exec } from "child_process";

export interface ProcessInfo {
  pid: number;
  name: string;
  path?: string;
}

export function getRunningProcesses(): Promise<ProcessInfo[]> {
  return new Promise((resolve, reject) => {
    exec("powershell -Command \"Get-Process | Select-Object Id,ProcessName | ConvertTo-Json\"", (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }

      try {
        const data = JSON.parse(stdout);
        const processes = Array.isArray(data) ? data : [data];

        resolve(processes.map((process) => ({
          pid: Number(process.Id),
          name: String(process.ProcessName)
        })));
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}
