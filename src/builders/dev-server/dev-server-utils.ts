import { DevServerBuilderOptions } from '@angular-devkit/build-angular';

import { getCertPath } from '../../shared/cert-utils';

export function applySkyuxDevServerOptions(
  options: DevServerBuilderOptions
): void {
  // Enforce HTTPS.
  options.ssl = true;
  options.sslCert = getCertPath('skyux-server.crt');
  options.sslKey = getCertPath('skyux-server.key');
}
