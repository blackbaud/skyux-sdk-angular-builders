import fs from 'fs-extra';
import { homedir } from 'os';

export function getCertPath(fileName: string): string {
  const certPath = `${homedir()}/.skyux/certs/${fileName}`;
  if (fs.existsSync(certPath)) {
    return certPath;
  }

  throw new Error(
    `Unable to locate certificate named "${certPath}".\n` +
      'Please install the latest version of `@skyux-sdk/cli` and run `skyux certs install`.'
  );
}
