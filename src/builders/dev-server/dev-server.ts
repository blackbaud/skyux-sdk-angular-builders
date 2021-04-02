import { BuilderContext, createBuilder } from '@angular-devkit/architect';

import {
  DevServerBuilderOutput,
  executeDevServerBuilder
} from '@angular-devkit/build-angular';

import { Observable } from 'rxjs';

import { getSkyuxConfig } from '../../shared/skyux-config-utils';

import { SkyuxDevServerBuilderOptions } from './dev-server-options';

import { applySkyuxDevServerOptions } from './dev-server-utils';

import { getDevServerTransforms } from './dev-server-transforms';

function executeSkyuxDevServerBuilder(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): Observable<DevServerBuilderOutput> {
  const skyuxConfig = getSkyuxConfig();

  const projectName = context.target!.project!;
  applySkyuxDevServerOptions(options, projectName);

  // const projectName = context.target!.project!;
  // options.deployUrl = options.deployUrl + projectName;

  return executeDevServerBuilder(
    options,
    context,
    getDevServerTransforms(options, context, skyuxConfig)
  );
}

export default createBuilder<
  SkyuxDevServerBuilderOptions,
  DevServerBuilderOutput
>(executeSkyuxDevServerBuilder);
