import {
  BuilderContext
} from '@angular-devkit/architect';

import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  SkyuxOpenHostURLPlugin
} from '../../webpack/plugins/open-host-url/open-host-url';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

/**
 * Allows adjustments to the default Angular "dev-server" webpack config.
 * @param options The input options passed to the builder.
 * @param context The context of the builder execution.
 */
function getDevServerWepbackConfigTransformer(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
): ExecutionTransformer<WebpackConfig> {

  return (webpackConfig) => {

    if (options.skyuxLaunch === 'host') {
      /*istanbul ignore next line*/
      const pathName = context.target?.project!;

      if (!webpackConfig.plugins) {
        webpackConfig.plugins = [];
      }

      webpackConfig.plugins.push(
        new SkyuxOpenHostURLPlugin(
          pathName,
          {
            hostUrl: options.skyuxHostUrl!,
            localUrl: options.deployUrl!
          }
        )
      );
    }

    return webpackConfig;
  };
}

export function getDevServerTransforms(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext
) {
  return {
    webpackConfiguration: getDevServerWepbackConfigTransformer(options, context)
  };
}
