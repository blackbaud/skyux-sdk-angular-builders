import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  SkyuxSaveHostMetadataPlugin
} from '../../webpack/plugins/save-host-metadata/save-host-metadata-plugin';

/**
 * Allows adjustments to the default Angular "browser" webpack config.
 * @param options The input options passed to the builder.
 * @param context The context of the builder execution.
 */
function getBrowserWepbackConfigTransformer(): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {

    webpackConfig.plugins = webpackConfig.plugins || [];

    webpackConfig.plugins.push(
      new SkyuxSaveHostMetadataPlugin()
    );

    return webpackConfig;
  };

}

export function getBrowserTransforms() {
  return {
    webpackConfiguration: getBrowserWepbackConfigTransformer()
  };
}
