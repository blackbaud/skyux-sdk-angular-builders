import {
  DevServerBuilderOptions
} from '@angular-devkit/build-angular';

import {
  homedir
} from 'os';

/**
 * The input options passed to the builder.
 */
export type SkyuxDevServerBuilderOptions = DevServerBuilderOptions & {

  skyuxHostUrl?: string;

  /**
   * Specifies whether or not the app should be launched with the SKY UX Host server or the localhost server.
   */
  skyuxLaunch?: 'host' | 'local';

};

function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

function getCertPath(fileName: string): string {
  return `${homedir()}/.skyux/certs/${fileName}`;
}

export function applySkyuxDevServerOptions(options: SkyuxDevServerBuilderOptions): void {

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
}
