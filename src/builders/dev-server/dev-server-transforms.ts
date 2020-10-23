import {
  BuilderContext
} from '@angular-devkit/architect';

import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  SkyuxAssetUrlsPlugin
} from '../../webpack/plugins/asset-urls/asset-urls';

import {
  SkyuxOpenHostURLPlugin
} from '../../webpack/plugins/open-host-url/open-host-url';

import {
  getAssetUrlsLoaderRule
} from '../../webpack/loaders/asset-urls/asset-urls-loader-rule';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

import {
  getLocalUrlFromOptions
} from './dev-server-utils';
import { SkyuxAssetService } from '../../shared/asset-service';

/**
 * Allows adjustments to the default Angular "dev-server" webpack config.
 * @param options The input options passed to the builder.
 * @param context The context of the builder execution.
 */
function getDevServerWepbackConfigTransformer(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {

    if (options.skyuxLaunch === 'host') {

      const assetService = new SkyuxAssetService();
      const assetBaseUrl = options.deployUrl!;

      /*istanbul ignore next line*/
      const pathName = context.target?.project!;

      webpackConfig.module?.rules?.push(
        getAssetUrlsLoaderRule(assetBaseUrl, assetService)
      );

      webpackConfig.plugins?.push(
        new SkyuxAssetUrlsPlugin(assetService),
        new SkyuxOpenHostURLPlugin({
          hostUrl: options.skyuxHostUrl!,
          localUrl: getLocalUrlFromOptions(options),
          pathName
        })
      );
    }

    return webpackConfig;
  };
}

export function getDevServerTransforms(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
) {
  return {
    webpackConfiguration: getDevServerWepbackConfigTransformer(options, context)
  };
}
