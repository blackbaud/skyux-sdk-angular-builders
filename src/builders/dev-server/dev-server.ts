import {
  BuilderContext,
  createBuilder
} from '@angular-devkit/architect';

import {
  DevServerBuilderOutput,
  executeDevServerBuilder
} from '@angular-devkit/build-angular';

import {
  homedir
} from 'os';

import {
  Observable
} from 'rxjs';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

import {
  getDevServerWepbackConfigTransformer
} from './webpack-config-transformer';

function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

function getCertPath(fileName: string): string {
  return `${homedir()}/.skyux/certs/${fileName}`;
}

function executeSkyuxDevServerBuilder(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): Observable<DevServerBuilderOutput> {

  if (options.skyuxLaunch === 'host') {

    const hostUrl = ensureTrailingSlash(options.skyuxHostUrl || 'https://app.blackbaud.com/');
    const localUrl = `https://${options.host}:${options.port}/`;

    options.skyuxHostUrl = hostUrl;

    // Enforce HTTPS.
    options.ssl = true;

    // Point image URLs back to localhost.
    options.baseHref = localUrl;
    options.servePathDefaultWarning = false;

    // Point live-reloading back to localhost.
    options.publicHost = localUrl;
    options.allowedHosts = ['.blackbaud.com'];

    // Point lazy-loaded modules to the localhost URL.
    options.deployUrl = localUrl;
  }

  if (options.ssl) {
    options.sslCert = getCertPath('skyux-server.crt');
    options.sslKey = getCertPath('skyux-server.key');
  }

  return executeDevServerBuilder(options, context, {
    webpackConfiguration: getDevServerWepbackConfigTransformer(options, context)
  });
}

export default createBuilder<SkyuxDevServerBuilderOptions, DevServerBuilderOutput>(
  executeSkyuxDevServerBuilder
);
