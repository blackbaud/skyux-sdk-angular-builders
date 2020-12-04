import {
  BuilderContext
} from '@angular-devkit/architect';

import {
  DevServerBuilderOptions
} from '@angular-devkit/build-angular';

import {
  getCertPath
} from '../../shared/cert-utils';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

export function getLocalUrlFromOptions(options: DevServerBuilderOptions): string {
  return `https://${options.host}:${options.port}/`;
}

export function getDevServerBuilderOptions(
  skyuxOptions: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): DevServerBuilderOptions {

  const target = context.target!;
  let browserTarget = `${target.project}:build`;
  if (target.configuration) {
    browserTarget += target.configuration;
  }

  const options: DevServerBuilderOptions = {
    browserTarget,
    host: 'localhost',
    port: 4200
  };

  // Enforce HTTPS.
  options.ssl = true;
  options.sslCert = getCertPath('skyux-server.crt');
  options.sslKey = getCertPath('skyux-server.key');

  // Set options specific to SKY UX Host.
  if (skyuxOptions.launch === 'host') {
    const localUrl = getLocalUrlFromOptions(options);

    // Point live-reloading back to localhost.
    options.publicHost = localUrl;
    options.allowedHosts = ['.blackbaud.com'];

    // Point lazy-loaded modules to the localhost URL.
    options.deployUrl = localUrl;
    options.servePath = '/';
  } else {
    // Open the user's default browser automatically in 'local' mode.
    options.open = true;
  }

  return options;
}
