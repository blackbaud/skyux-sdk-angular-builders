import {
  BuilderContext,
  createBuilder
} from '@angular-devkit/architect';

import {
  DevServerBuilderOptions,
  DevServerBuilderOutput,
  executeDevServerBuilder
} from '@angular-devkit/build-angular';

import {
  JsonObject
} from '@angular-devkit/core';

import {
  Observable
} from 'rxjs';

import {
  getCertPath
} from '../../shared/cert-utils';

import {
  getHostUrlFromOptions
} from '../../shared/host-utils';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

import {
  getDevServerTransforms
} from './dev-server-transforms';

import {
  getLocalUrlFromOptions
} from './dev-server-utils';

function getDevServerBuilderOptions(
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

  switch (skyuxOptions.launch) {
    case 'host':
    default:
      const localUrl = getLocalUrlFromOptions(options);

      // Point live-reloading back to localhost.
      options.publicHost = localUrl;
      options.allowedHosts = ['.blackbaud.com'];

      // Point lazy-loaded modules to the localhost URL.
      options.deployUrl = localUrl;
      options.servePath = '/';
      break;

    case 'local':
      // Open the user's default browser automatically.
      options.open = true;
      break;
  }

  return options;
}

function executeSkyuxDevServerBuilder(
  skyuxOptions: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): Observable<DevServerBuilderOutput> {

  console.log('Options before:', skyuxOptions);

  skyuxOptions.launch = skyuxOptions.launch || 'host';
  skyuxOptions.hostUrl = getHostUrlFromOptions(skyuxOptions);

  console.log('Options after:', skyuxOptions);

  const angularOptions = getDevServerBuilderOptions(skyuxOptions, context);

  return executeDevServerBuilder(
    angularOptions,
    context,
    getDevServerTransforms(angularOptions, skyuxOptions, context)
  );

}

export default createBuilder<SkyuxDevServerBuilderOptions & JsonObject, DevServerBuilderOutput>(
  executeSkyuxDevServerBuilder
);
