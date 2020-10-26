import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  SkyuxAssetUrlsPlugin
} from '../../webpack/plugins/asset-urls/asset-urls-plugin';

import {
  SkyuxSaveHostMetadataPlugin
} from '../../webpack/plugins/save-host-metadata/save-host-metadata-plugin';

import {
  getAssetUrlsLoaderRule
} from '../../webpack/loaders/asset-urls/asset-urls-loader-rule';

import {
  SkyuxBrowserBuilderOptions
} from './browser-options';

/**
 * Allows adjustments to the default Angular "browser" webpack config.
 * @param options The input options passed to the builder.
 */
function getBrowserWepbackConfigTransformer(
  options: SkyuxBrowserBuilderOptions
): ExecutionTransformer<WebpackConfig> {
  return (config) => {

    config.plugins = config.plugins || [];
    config.module = config.module || { rules: [] };

    if (options.deployUrl) {
      const assetBaseUrl = options.deployUrl!;

      config.module.rules.push(
        getAssetUrlsLoaderRule(assetBaseUrl)
      );

      config.plugins.push(
        new SkyuxAssetUrlsPlugin()
      );
    }

    config.plugins.push(
      new SkyuxSaveHostMetadataPlugin()
    );

    return config;
  };

}

export function getBrowserTransforms(
  options: SkyuxBrowserBuilderOptions
) {
  return {
    webpackConfiguration: getBrowserWepbackConfigTransformer(options)
  };
}
