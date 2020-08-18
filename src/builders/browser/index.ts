import {
  resolve
} from 'path';

import {
  BuilderOutput,
  BuilderContext,
  createBuilder
} from '@angular-devkit/architect';

import {
  BrowserBuilderOptions,
  executeBrowserBuilder
} from '@angular-devkit/build-angular';

import {
  JsonObject
} from '@angular-devkit/core';

import {
  Configuration
} from 'webpack';

import {
  AngularCompilerPlugin
} from '@ngtools/webpack';

import {
  Observable
} from 'rxjs';

import {
  SaveMetadataPlugin
} from '../../webpack/plugins/save-metadata';

import {
  AssetStateRunnerPlugin
} from '../../webpack/plugins/asset-state-runner';

import {
  AssetState
} from '../../shared/asset-state';

import {
  Transforms
} from '../../shared/transforms.model';

type SkyuxBrowserBuilderOptions = BrowserBuilderOptions & {
  assetsBaseUrl: string;
};

function skyuxWebpackConfig(config: Configuration) {
  if (config.module?.rules) {
    config.module.rules.push({
      // https://github.com/angular/angular-cli/issues/16544#issuecomment-571245469
      enforce: 'pre',
      test: /.ts$/,
      use: resolve(__dirname, '../../webpack/loaders/assets-in-ts'),
    });

    config.module.rules.push({
      test: /.html$/,
      use: [
        'raw-loader',
        resolve(__dirname, '../../webpack/loaders/assets-in-html')
      ]
    });
  }

  if (config.plugins) {
    config.plugins.push(SaveMetadataPlugin, AssetStateRunnerPlugin);
    config.plugins.some(plugin => {
      if (plugin instanceof AngularCompilerPlugin) {
        (plugin as any)._options.directTemplateLoading = false;
        return true;
      }
    });
  }

  return config;
}

function skyuxBrowser(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext,
  transforms: Transforms = {}
): Observable<BuilderOutput> {
  AssetState.setBaseUrl(options.assetsBaseUrl);
  transforms.webpackConfiguration = skyuxWebpackConfig;
  return executeBrowserBuilder(options, context, transforms);
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(skyuxBrowser);
