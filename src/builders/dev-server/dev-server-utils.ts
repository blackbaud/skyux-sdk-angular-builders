import { BuilderContext } from '@angular-devkit/architect';

import { getCertPath } from '../../shared/cert-utils';
import { getBaseHref } from '../../shared/context-utils';
import { ensureBaseHref } from '../../shared/url-utils';

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
  const baseHref = getBaseHref(context);

  // Point live-reloading back to localhost.
  options.publicHost = ensureBaseHref(localUrl, baseHref);
  options.allowedHosts = ['.blackbaud.com'];

  // Point lazy-loaded modules to the localhost URL.
  options.deployUrl = ensureBaseHref(localUrl, baseHref);
  options.servePath = baseHref;

  // Disable Angular CLI's opening behavior since the Host URL Webpack plugin
  // handles launching the browser.
  options.open = false;

  // Default to opening the SKY UX Host URL.
  /* istanbul ignore else */
  if (options.skyuxOpen === undefined) {
    options.skyuxOpen = true;
  }

  // During e2e tests, Angular serves all assets from the root,
  // so we'll need to remove our baseHref from the serve path.
  const configurationName = context.target!.configuration;
  if (configurationName === 'e2e' || configurationName === 'e2eProduction') {
    options.servePath = '/';
    options.deployUrl = localUrl;
  }
}
