import {
  getCertPath
} from '../../shared/cert-utils';

import {
  ensureTrailingSlash
} from '../../shared/url-utils';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

export function getLocalUrlFromOptions(options: SkyuxDevServerBuilderOptions): string {
  return `https://${options.host}:${options.port}/`;
}

function getHostBaseUrlFromOptions(options: Partial<SkyuxDevServerBuilderOptions>): string {
  return ensureTrailingSlash(options.skyuxHostUrl || 'https://app.blackbaud.com/');
}

export function applySkyuxDevServerOptions(options: SkyuxDevServerBuilderOptions): void {

  options.host = options.host || 'localhost';
  options.port = options.port || 4200;

  // Enforce HTTPS.
  options.ssl = true;
  options.sslCert = getCertPath('skyux-server.crt');
  options.sslKey = getCertPath('skyux-server.key');

  // Set options specific to SKY UX Host.
  if (options.skyuxLaunch === 'host') {
    const hostUrl = getHostBaseUrlFromOptions(options);
    const localUrl = getLocalUrlFromOptions(options);

    options.skyuxHostUrl = hostUrl;

    // Point live-reloading back to localhost.
    options.publicHost = localUrl;
    options.allowedHosts = ['.blackbaud.com'];

    // Point lazy-loaded modules to the localhost URL.
    options.deployUrl = localUrl;
    options.servePath = '/';

    // Disable Angular CLI's opening behavior since the Host URL Webpack plugin
    // handles launching the browser.
    options.open = false;

    // Default to opening the SKY UX Host URL.
    /* istanbul ignore else */
    if (options.skyuxOpen === undefined) {
      options.skyuxOpen = true;
    }
  }

  // Open the user's default browser automatically.
  if (options.skyuxLaunch === 'local') {
    options.open = true;
  }
}
