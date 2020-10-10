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

export function applySkyuxDevServerOptions(options: SkyuxDevServerBuilderOptions): SkyuxDevServerBuilderOptions {
  const clone: SkyuxDevServerBuilderOptions = {...options};

  // Set options specific to SKY UX Host.
  if (clone.skyuxLaunch === 'host') {
    const hostUrl = ensureTrailingSlash(clone.skyuxHostUrl || 'https://app.blackbaud.com/');
    const localUrl = `https://${clone.host}:${clone.port}/`;

    clone.skyuxHostUrl = hostUrl;

    // Enforce HTTPS.
    clone.ssl = true;

    // Point image URLs back to localhost.
    clone.baseHref = localUrl;
    clone.servePathDefaultWarning = false;

    // Point live-reloading back to localhost.
    clone.publicHost = localUrl;
    clone.allowedHosts = ['.blackbaud.com'];

    // Point lazy-loaded modules to the localhost URL.
    clone.deployUrl = localUrl;
  }

  if (clone.ssl) {
    clone.sslCert = getCertPath('skyux-server.crt');
    clone.sslKey = getCertPath('skyux-server.key');
  }

  return clone;
}
