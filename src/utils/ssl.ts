import * as os from 'os';

import * as path from 'path';

export function getSSLCertificatePath(): string {
  return path.resolve(`${os.homedir()}/.skyux/certs/skyux-server.crt`);
}

export function getSSLKeyPath(): string {
  return path.resolve(`${os.homedir()}/.skyux/certs/skyux-server.key`);
}
