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
  SkyuxBrowserBuilderOptions
} from './browser-options';

/**
 * Allows adjustments to the default Angular "browser" webpack config.
 * @param options The input options passed to the builder.
 */
function getBrowserWepbackConfigTransformer(
  options: SkyuxBrowserBuilderOptions
): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {

    webpackConfig.plugins = webpackConfig.plugins || [];

    if (options.deployUrl) {
      webpackConfig.plugins.push(
        new SkyuxAssetUrlsPlugin({
          assetBaseUrl: options.deployUrl
        })
      );
    }

    webpackConfig.plugins.push(
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
