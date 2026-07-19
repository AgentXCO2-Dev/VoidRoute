import { exec } from "child_process";

export interface NetworkAdapter {
  name: string;
  ipv4: string;
  gateway: string;
  dns: string[];
  status: string;
}

export function getNetworkAdapters(): Promise<NetworkAdapter[]> {
  return new Promise((resolve, reject) => {
    exec("powershell -Command \"Get-NetIPConfiguration | ConvertTo-Json\"", (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }

      try {
        const data = JSON.parse(stdout);
        const adapters = Array.isArray(data) ? data : [data];

        resolve(adapters.map((adapter) => ({
          name: adapter.InterfaceAlias ?? "Unknown",
          ipv4: adapter.IPv4Address?.IPv4Address ?? "Unavailable",
          gateway: adapter.IPv4DefaultGateway?.NextHop ?? "Unavailable",
          dns: [],
          status: adapter.NetAdapter?.Status ?? "Unknown"
        })));
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}
