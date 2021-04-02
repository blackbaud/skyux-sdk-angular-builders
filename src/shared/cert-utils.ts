import { homedir } from 'os';

export function getCertPath(
  fileName: string
): string {
  return `${homedir()}/.skyux/certs/${fileName}`;
}
