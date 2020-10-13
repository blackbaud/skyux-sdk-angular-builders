import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  SkyuxSaveMetadataPlugin
} from '../../webpack/plugins/save-metadata/save-metadata';

/**
 * Allows adjustments to the default Angular "browser" webpack config.
 * @param options The input options passed to the builder.
 * @param context The context of the builder execution.
 */
function getBrowserWepbackConfigTransformer(): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {

    if (!webpackConfig.plugins) {
      webpackConfig.plugins = [];
    }

    webpackConfig.plugins.push(
      new SkyuxSaveMetadataPlugin()
    );

    return webpackConfig;
  };

}

export function getBrowserTransforms() {
  return {
    webpackConfiguration: getBrowserWepbackConfigTransformer()
  };
}
