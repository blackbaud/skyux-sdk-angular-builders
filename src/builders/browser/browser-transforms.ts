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
  SkyuxSaveHostMetadataPlugin
} from '../../webpack/plugins/save-host-metadata/save-host-metadata';

import {
  getAssetUrlsLoaderRule
} from '../../webpack/loaders/asset-urls/asset-urls-loader-rule';

import {
  SkyuxBrowserBuilderOptions
} from './browser-options';
import { SkyuxAssetService } from '../../shared/asset-service';

/**
 * Allows adjustments to the default Angular "browser" webpack config.
 * @param options The input options passed to the builder.
 */
function getBrowserWepbackConfigTransformer(
  options: SkyuxBrowserBuilderOptions
): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {

    if (options.deployUrl) {
      const assetService = new SkyuxAssetService();
      const assetBaseUrl = options.deployUrl!;

      webpackConfig.module?.rules?.push(
        getAssetUrlsLoaderRule(assetBaseUrl, assetService)
      );

      webpackConfig.plugins?.push(
        new SkyuxAssetUrlsPlugin(assetService)
      );
    }

    webpackConfig.plugins?.push(
      new SkyuxSaveHostMetadataPlugin()
    );

    return webpackConfig;
  };

}

export function getBrowserTransforms(
  options: SkyuxBrowserBuilderOptions
) {
  return {
    webpackConfiguration: getBrowserWepbackConfigTransformer(options)
  };
}
