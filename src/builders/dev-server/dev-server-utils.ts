import {
  getCertPath
} from '../../shared/cert-utils';

import {
  getHostUrlFromOptions
} from '../../shared/host-utils';
import { getAvailablePort } from '../../shared/url-utils';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

export async function applySkyuxDevServerOptions(options: SkyuxDevServerBuilderOptions): Promise<void> {

  if (options.skyuxLaunch === undefined) {
    return Promise.resolve();
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
    const localUrl = `https://${options.host}:${options.port}/`;

    options.skyuxHostUrl = hostUrl;

    // Point image URLs back to localhost.
    options.baseHref = localUrl;
    options.servePathDefaultWarning = false;

    // Point live-reloading back to localhost.
    options.publicHost = localUrl;
    options.allowedHosts = ['.blackbaud.com'];

    // Point lazy-loaded modules to the localhost URL.
    options.deployUrl = localUrl;
  }

  // Open the user's default browser automatically.
  if (options.skyuxLaunch === 'local') {
    options.open = true;
  }
}
