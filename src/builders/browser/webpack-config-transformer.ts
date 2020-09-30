import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  SkyuxSaveMetadataPlugin
} from '../../webpack/plugins/save-metadata';

/**
 * Allows adjustments to the default Angular webpack config.
 */
export function getBrowserWepbackConfigTransformer(): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {

    webpackConfig.plugins?.push(
      new SkyuxSaveMetadataPlugin()
    );

    return webpackConfig;
  };

}
