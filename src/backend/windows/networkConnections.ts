import { exec } from "child_process";

export interface NetworkConnection {
  localAddress: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
  state: string;
}

export function getNetworkConnections(): Promise<NetworkConnection[]> {
  return new Promise((resolve, reject) => {
    exec("powershell -Command \"Get-NetTCPConnection | ConvertTo-Json\"", (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }

      try {
        const data = JSON.parse(stdout);
        const connections = Array.isArray(data) ? data : [data];

        resolve(connections.map((connection) => ({
          localAddress: connection.LocalAddress,
          localPort: Number(connection.LocalPort),
          remoteAddress: connection.RemoteAddress,
          remotePort: Number(connection.RemotePort),
          state: connection.State
        })));
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}
