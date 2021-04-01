import { ExecutionTransformer } from '@angular-devkit/build-angular';

import { Configuration as WebpackConfig } from 'webpack';

import { SkyuxHostAssetsFallbackPlugin } from '../../tools/webpack/plugins/host-assets-fallback/host-assets-fallback.plugin';

import { SkyuxSaveHostMetadataPlugin } from '../../tools/webpack/plugins/save-host-metadata/save-host-metadata.plugin';

import { applyAppAssetsWebpackConfig } from '../../tools/webpack/app-assets-webpack-config';

import { SkyuxBrowserBuilderOptions } from './browser-options';

/**
 * Allows adjustments to the default Angular "browser" webpack config.
 * @param options The input options passed to the builder.
 * @param context The context of the builder execution.
 */
function getBrowserWepbackConfigTransformer(
  options: SkyuxBrowserBuilderOptions
): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {
    webpackConfig.plugins = webpackConfig.plugins || [];

    webpackConfig.plugins.push(
      new SkyuxHostAssetsFallbackPlugin(),
      new SkyuxSaveHostMetadataPlugin()
    );

    applyAppAssetsWebpackConfig(webpackConfig, options.deployUrl);

    return webpackConfig;
  };
}

export function getBrowserTransforms(options: SkyuxBrowserBuilderOptions) {
  return {
    webpackConfiguration: getBrowserWepbackConfigTransformer(options)
  };
}
