import {
  BuilderContext
} from '@angular-devkit/architect';

import {
  DevServerBuilderOptions,
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  applyAppAssetsConfig
} from '../../webpack/app-assets-utils';

import {
  SkyuxOpenHostURLPlugin
} from '../../webpack/plugins/open-host-url/open-host-url.plugin';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

import {
  getLocalUrlFromOptions
} from './dev-server-utils';

/**
 * Allows adjustments to the default Angular "dev-server" webpack config.
 * @param options The input options passed to the builder.
 * @param context The context of the builder execution.
 */
function getDevServerWepbackConfigTransformer(
  angularOptions: DevServerBuilderOptions,
  skyuxOptions: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {

    webpackConfig.plugins = webpackConfig.plugins || [];

    if (skyuxOptions.launch === 'host') {
      /*istanbul ignore next line*/
      const pathName = context.target?.project!;

      webpackConfig.plugins.push(
        new SkyuxOpenHostURLPlugin({
          hostUrl: skyuxOptions.hostUrl!,
          localUrl: getLocalUrlFromOptions(angularOptions),
          pathName
        })
      );
    }

    applyAppAssetsConfig(webpackConfig, angularOptions);

    return webpackConfig;
  };
}

export function getDevServerTransforms(
  angularOptions: DevServerBuilderOptions,
  skyuxOptions: SkyuxDevServerBuilderOptions,
  context: BuilderContext
) {
  return {
    webpackConfiguration: getDevServerWepbackConfigTransformer(angularOptions, skyuxOptions, context)
  };
}
