import {
  BuilderContext
} from '@angular-devkit/architect';

import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfig
} from 'webpack';

// import {
//   SkyuxOpenHostURLPlugin
// } from '../../webpack/plugins/open-host-url/open-host-url.plugin';

// import {
//   applyAppAssetsWebpackConfig
// } from '../../webpack/app-assets-webpack-config';

import {
  applySkyuxconfigWebpackConfig
} from '../../webpack/skyuxconfig-webpack-config';

import {
  SkyuxKarmaBuilderOptions
} from './karma-options';

// import {
//   getLocalUrlFromOptions
// } from './dev-server-utils';

/**
 * Allows adjustments to the default Angular "dev-server" webpack config.
 * @param options The input options passed to the builder.
 * @param context The context of the builder execution.
 */
function getKarmaWepbackConfigTransformer(
  _options: SkyuxKarmaBuilderOptions,
  _context: BuilderContext
): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {

    // const localUrl = getLocalUrlFromOptions(options);
    // applyAppAssetsWebpackConfig(webpackConfig, localUrl);
    applySkyuxconfigWebpackConfig(webpackConfig, {
      host: {
        url: undefined
      }
    });

    return webpackConfig;
  };
}

export function getKarmaTransforms(
  options: SkyuxKarmaBuilderOptions,
  context: BuilderContext
) {
  return {
    webpackConfiguration: getKarmaWepbackConfigTransformer(options, context)
  };
}
