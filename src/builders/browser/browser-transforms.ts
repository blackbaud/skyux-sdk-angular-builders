import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  SkyuxSaveHostMetadataPlugin
} from '../../webpack/plugins/save-host-metadata/save-host-metadata.plugin';

import {
  applyAppAssetsWebpackConfig
} from '../../webpack/app-assets-webpack-config';

import {
  applySkyuxconfigWebpackConfig
} from '../../webpack/skyuxconfig-webpack-config';

import {
  SkyuxBrowserBuilderOptions
} from './browser-options';

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
      new SkyuxSaveHostMetadataPlugin()
    );

    applyAppAssetsWebpackConfig(webpackConfig, options.deployUrl);
    applySkyuxconfigWebpackConfig(webpackConfig, {
      host: {
        url: undefined
      }
    });

    return webpackConfig;
  };

}

export function getBrowserTransforms(options: SkyuxBrowserBuilderOptions) {
  return {
    webpackConfiguration: getBrowserWepbackConfigTransformer(options)
  };
}
