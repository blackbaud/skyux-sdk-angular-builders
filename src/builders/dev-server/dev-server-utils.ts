import { BuilderContext } from '@angular-devkit/architect';

import { getCertPath } from '../../shared/cert-utils';

import { SkyuxDevServerBuilderOptions } from './dev-server-options';

export function getLocalUrlFromOptions(
  options: SkyuxDevServerBuilderOptions
): string {
  return `https://${options.host}:${options.port}/`;
}

export function applySkyuxDevServerOptions(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): void {
  options.host = options.host || 'localhost';
  options.port = options.port || 4200;

  // Enforce HTTPS.
  options.ssl = true;
  options.sslCert = getCertPath('skyux-server.crt');
  options.sslKey = getCertPath('skyux-server.key');

  const localUrl = getLocalUrlFromOptions(options);
  const baseHref = context.target!.project!;

  // Point live-reloading back to localhost.
  options.publicHost = `${localUrl}${baseHref}/`;
  options.allowedHosts = ['.blackbaud.com'];

  // Point lazy-loaded modules to the localhost URL.
  options.deployUrl = `${localUrl}${baseHref}/`;
  options.servePath = `/${baseHref}`;

  // Disable Angular CLI's opening behavior since the Host URL Webpack plugin
  // handles launching the browser.
  options.open = false;

  // Default to opening the SKY UX Host URL.
  /* istanbul ignore else */
  if (options.skyuxOpen === undefined) {
    options.skyuxOpen = true;
  }
}
