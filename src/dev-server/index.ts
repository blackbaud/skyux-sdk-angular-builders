import {
  BuilderContext,
  createBuilder,
  targetFromTargetString
} from '@angular-devkit/architect';

import {
  DevServerBuilderOptions,
  DevServerBuilderOutput,
  executeDevServerBuilder
} from '@angular-devkit/build-angular';

import {
  from as observableFrom,
  Observable
} from 'rxjs';

import {
  switchMap
} from 'rxjs/operators';

import {
  SkyBuilderOptions
} from '../builder-options';

import {
  getTransforms
} from '../utils/common';

import {
  getSSLCertificatePath,
  getSSLKeyPath
} from '../utils/ssl';

export function devServerBuilder(
  options: DevServerBuilderOptions,
  context: BuilderContext
): Observable<DevServerBuilderOutput> {

  async function setup() {
    const browserTarget = targetFromTargetString(options.browserTarget);
    return (context.getTargetOptions(browserTarget) as unknown) as SkyBuilderOptions;
  }

  return observableFrom(setup()).pipe(
    switchMap(targetOptions => {
      const baseHref = targetOptions.skyux.name;

      // Overrides to provide to Angular's serve command.
      options.baseHref = baseHref;
      options.host = 'localhost';
      options.publicHost = 'localhost';
      options.ssl = true;
      options.sslCert = getSSLCertificatePath();
      options.sslKey = getSSLKeyPath();

      // Overrides to provide to our Webpack plugin.
      targetOptions.baseHref = baseHref;
      targetOptions.port = 8080;

      return executeDevServerBuilder(options, context, getTransforms(targetOptions, context));
    })
  );
}

export default createBuilder<DevServerBuilderOptions, DevServerBuilderOutput>(devServerBuilder);
