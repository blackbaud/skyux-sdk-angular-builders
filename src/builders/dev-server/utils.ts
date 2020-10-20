import {
  homedir
} from 'os';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

export function getCertPath(fileName: string): string {
  return `${homedir()}/.skyux/certs/${fileName}`;
}

export function applySkyuxDevServerOptions(options: SkyuxDevServerBuilderOptions): void {

  if (options.skyuxLaunch === undefined) {
    return;
  }

  // Enforce HTTPS.
  options.ssl = true;
  options.sslCert = getCertPath('skyux-server.crt');
  options.sslKey = getCertPath('skyux-server.key');

  // Set options specific to SKY UX Host.
  if (options.skyuxLaunch === 'host') {
    const hostUrl = ensureTrailingSlash(options.skyuxHostUrl || 'https://app.blackbaud.com/');
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
