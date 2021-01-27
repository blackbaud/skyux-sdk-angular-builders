import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  createAppAssetsMap
} from '../../shared/app-assets-utils';

import {
  SkyuxAppAssetsPlugin
} from '../../webpack/plugins/app-assets/app-assets.plugin';

import {
  SkyuxSaveHostMetadataPlugin
} from '../../webpack/plugins/save-host-metadata/save-host-metadata.plugin';

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

    const assetsMap = createAppAssetsMap(options.deployUrl || '');

    webpackConfig.plugins = webpackConfig.plugins || [];

    webpackConfig.plugins.push(
      new SkyuxSaveHostMetadataPlugin(),
      new SkyuxAppAssetsPlugin({
        assetsMap
      })
    );

    return webpackConfig;
  };

}

export function getBrowserTransforms(options: SkyuxBrowserBuilderOptions) {
  return {
    webpackConfiguration: getBrowserWepbackConfigTransformer(options)
  };
}
