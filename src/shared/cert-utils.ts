import fs from 'fs-extra';
import { homedir } from 'os';

export function getCertPath(fileName: string): string {
  return `${homedir()}/.skyux/certs/${fileName}`;
}

export function readCert(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Unable to locate certificate named "${filePath}".\n` +
        'Please install the latest SKY UX CLI and run `skyux certs install`.'
    );
  }

  return fs.readFileSync(filePath, { encoding: 'utf-8' });
}
