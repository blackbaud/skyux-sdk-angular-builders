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
  Configuration
} from 'webpack';

import {
  Observable
} from 'rxjs';

import {
  Transforms
} from '../../shared/transforms.model';

const skyuxDevServer  = (
  options: any,
  context: BuilderContext,
  transforms: Transforms = {}
): Observable<DevServerBuilderOutput> => {

  transforms.webpackConfiguration = (config: Configuration) => {
    // Any future webpack transformations would go here.
    return config;
  };

  return executeDevServerBuilder(options, context, transforms);
}

export default createBuilder<DevServerBuilderOptions, DevServerBuilderOutput>(skyuxDevServer);
