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
} from '../../webpack/plugins/open-host-url/open-host-url.plugin';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

import {
  getLocalUrlFromOptions
} from './dev-server-utils';

import {
  createAppAssetsMap
} from '../../shared/app-assets-utils';

import {
  SkyuxAppAssetsPlugin
} from '../../webpack/plugins/app-assets/app-assets.plugin';

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

    const localUrl = getLocalUrlFromOptions(options);
    const assetsMap = createAppAssetsMap(localUrl);

    webpackConfig.plugins = webpackConfig.plugins || [];

    if (options.skyuxLaunch === 'host') {
      /*istanbul ignore next line*/
      const pathName = context.target?.project!;

      webpackConfig.plugins.push(
        new SkyuxOpenHostURLPlugin({
          hostUrl: options.skyuxHostUrl!,
          localUrl,
          pathName,
          open: options.skyuxOpen!
        })
      );
    }

    webpackConfig.plugins.push(
      new SkyuxAppAssetsPlugin({
        assetsMap
      })
    );

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
