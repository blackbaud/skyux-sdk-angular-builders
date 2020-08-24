

import {
  BuilderOutput,
  BuilderContext,
  createBuilder
} from '@angular-devkit/architect';

import {
  executeBrowserBuilder
} from '@angular-devkit/build-angular';

import {
  JsonObject
} from '@angular-devkit/core';

import {
  Observable
} from 'rxjs';

import {
  applyDefaultOptions
} from '../../shared/default-options';

import {
  AssetState
} from '../../shared/asset-state';

import {
  SkyuxBrowserBuilderOptions
} from '../../shared/skyux-builder-options'

import {
  skyuxWebpackConfigFactory
} from '../../shared/webpack-config-utils';

import {
  Transforms
} from '../../shared/transforms.model';

function skyuxBrowser(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext,
  transforms: Transforms = {}
): Observable<BuilderOutput> {  

  applyDefaultOptions(options);

  AssetState.setBaseUrl(options.skyuxAssetsBaseUrl);

  skyuxWebpackConfigFactory(options, context, transforms);

  return executeBrowserBuilder(options, context, transforms);
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(skyuxBrowser);
