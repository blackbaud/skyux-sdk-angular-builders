import {
  BuilderContext,
  createBuilder
} from '@angular-devkit/architect';

import {
  DevServerBuilderOutput,
  executeDevServerBuilder
} from '@angular-devkit/build-angular';

import {
  Observable
} from 'rxjs';

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
  getDevServerBuilderOptions
} from './dev-server-utils';


function executeSkyuxDevServerBuilder(
  skyuxOptions: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): Observable<DevServerBuilderOutput> {

  skyuxOptions.launch = skyuxOptions.launch || 'host';
  skyuxOptions.hostUrl = getHostUrlFromOptions(skyuxOptions);

  const angularOptions = getDevServerBuilderOptions(skyuxOptions, context);

  return executeDevServerBuilder(
    angularOptions,
    context,
    getDevServerTransforms(angularOptions, skyuxOptions, context)
  );
}

export default createBuilder<SkyuxDevServerBuilderOptions, DevServerBuilderOutput>(
  executeSkyuxDevServerBuilder
);
