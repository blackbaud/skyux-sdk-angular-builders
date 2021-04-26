import { getCertPath } from '../../shared/cert-utils';

import { SkyuxDevServerBuilderOptions } from './dev-server-options';

export function applySkyuxDevServerOptions(
  options: SkyuxDevServerBuilderOptions
): void {
  // Enforce HTTPS.
  options.ssl = true;
  options.sslCert = getCertPath('skyux-server.crt');
  options.sslKey = getCertPath('skyux-server.key');

  options.open = true;
}
