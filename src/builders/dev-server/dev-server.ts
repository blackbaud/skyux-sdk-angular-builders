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
  applyDefaultOptions
} from '../../shared/default-options';

import {
  SkyuxDevServerBuilderOptions
} from '../../shared/skyux-builder-options';

import {
  Transforms
} from '../../shared/transforms.model';

import {
  skyuxWebpackConfigFactory
} from '../../shared/webpack-config-utils';

// Angular builder resolves and reads these paths
function getCertPath(fileName: string): string {
  return `${homedir()}/.skyux/certs/${fileName}`;
}

function skyuxDevServer (
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext,
  transforms: Transforms = {}
): Observable<DevServerBuilderOutput> {

  applyDefaultOptions(options);

  // TODO: Handle this - maybe error if they don't exist or dynamically just create them
  options.ssl = true;
  options.sslCert = getCertPath('skyux-server.crt');
  options.sslKey = getCertPath('skyux-server.key');

  // TODO: Find an open port to support multiple serves
  // await options.port = getPort();

  // Necessary in order to get images to point back to localhost
  options.baseHref = options.skyuxLocalUrl;
  options.servePathDefaultWarning = false;

  // Necessary to point the live-reloading back to localhost
  options.publicHost = options.skyuxLocalUrl;
  options.allowedHosts = ['.blackbaud.com'];

  // Expose skyuxOpen (host | local) for consistency
  // if local set angular's first-class open option
  if (options.skyuxOpen === 'local') {
    options.open = true;
  }

  skyuxWebpackConfigFactory(options, context, transforms);

  return executeDevServerBuilder(options, context, transforms);
}

export default createBuilder<SkyuxDevServerBuilderOptions, DevServerBuilderOutput>(skyuxDevServer);
