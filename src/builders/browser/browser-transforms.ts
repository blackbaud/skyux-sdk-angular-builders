import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  SkyuxConfig
} from '../../shared/skyux-config';

import {
  SkyuxSaveHostMetadataPlugin
} from '../../tools/webpack/plugins/save-host-metadata/save-host-metadata.plugin';

import {
  applyAppAssetsWebpackConfig
} from '../../tools/webpack/app-assets-webpack-config';

import {
  SkyuxBrowserBuilderOptions
} from './browser-options';

/**
 * Allows adjustments to the default Angular "browser" webpack config.
 * @param options The input options passed to the builder.
 * @param context The context of the builder execution.
 */
function getBrowserWepbackConfigTransformer(
  options: SkyuxBrowserBuilderOptions,
  skyuxConfig: SkyuxConfig
): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {
    webpackConfig.plugins = webpackConfig.plugins || [];

    webpackConfig.plugins.push(
      new SkyuxSaveHostMetadataPlugin(
        skyuxConfig
      )
    );

    applyAppAssetsWebpackConfig(webpackConfig, options.deployUrl);

    return webpackConfig;
  };

}

export function getBrowserTransforms(
  options: SkyuxBrowserBuilderOptions,
  skyuxConfig: SkyuxConfig
) {
  return {
    webpackConfiguration: getBrowserWepbackConfigTransformer(options, skyuxConfig)
  };
}
