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
  getWepbackConfigTransformer
} from '../../webpack/config-transformer';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url: `${url}/`;
}

function applyDefaultOptions(options: SkyuxDevServerBuilderOptions): void {
  const defaults: { [key: string]: string } = {
    skyuxHostUrl: 'https://app.blackbaud.com/',
    skyuxLocalUrl: `https://${options.host}:${options.port}/`
  };

  // The Angular schema validator includes all properties so merging with the spread operator will not work.
  // This catches prop: undefined that {...} will not.
  Object.keys(defaults).forEach(key => {
    if (!options[key]) {
      options[key] = defaults[key];
    }
  });

  options.skyuxHostUrl = ensureTrailingSlash(options.skyuxHostUrl as string);
  options.skyuxLocalUrl = ensureTrailingSlash(options.skyuxLocalUrl as string);
}

function getCertPath(fileName: string): string {
  return `${homedir()}/.skyux/certs/${fileName}`;
}

function skyuxDevServer(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): Observable<DevServerBuilderOutput> {

  applyDefaultOptions(options);

  options.ssl = true;
  options.sslCert = getCertPath('skyux-server.crt');
  options.sslKey = getCertPath('skyux-server.key');

  // Point image URLs back to localhost.
  options.baseHref = options.skyuxLocalUrl;
  options.servePathDefaultWarning = false;

  // Point live-reloading back to localhost.
  options.publicHost = options.skyuxLocalUrl;
  options.allowedHosts = ['.blackbaud.com'];

  // Point lazy-loaded modules to the localhost URL.
  options.deployUrl = options.skyuxLocalUrl;

  // If set to 'local' use Angular's first-class open option.
  // (This is to keep the experience consistent with SKY UX CLI.)
  if (options.skyuxOpen === 'local') {
    options.open = true;
  }

  return executeDevServerBuilder(options, context, {
    webpackConfiguration: getWepbackConfigTransformer(options, context)
  });
}

export default createBuilder<SkyuxDevServerBuilderOptions, DevServerBuilderOutput>(
  skyuxDevServer
);
