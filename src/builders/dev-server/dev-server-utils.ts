import {
  getCertPath
} from '../../shared/cert-utils';

import {
  getHostUrlFromOptions
} from '../../shared/host-utils';

import {
  getAvailablePort
} from '../../shared/url-utils';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

export function getLocalUrlFromOptions(options: SkyuxDevServerBuilderOptions): string {
  return `https://${options.host}:${options.port}/`;
}

export async function applySkyuxDevServerOptions(options: SkyuxDevServerBuilderOptions): Promise<void> {

  if (options.skyuxLaunch === undefined) {
    return;
  }

  options.port = await getAvailablePort({
    defaultPort: options.port
  });

  // Enforce HTTPS.
  options.ssl = true;
  options.sslCert = getCertPath('skyux-server.crt');
  options.sslKey = getCertPath('skyux-server.key');

  // Set options specific to SKY UX Host.
  if (options.skyuxLaunch === 'host') {
    const hostUrl = getHostUrlFromOptions(options);
    const localUrl = getLocalUrlFromOptions(options);

    options.skyuxHostUrl = hostUrl;

    // Point live-reloading back to localhost.
    options.publicHost = localUrl;
    options.allowedHosts = ['.blackbaud.com'];

    // Point lazy-loaded modules to the localhost URL.
    options.deployUrl = localUrl;
    options.servePathDefaultWarning = false;
  }

  // Open the user's default browser automatically.
  if (options.skyuxLaunch === 'local') {
    options.open = true;
  }
}
