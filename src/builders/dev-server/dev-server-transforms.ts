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
  SkyuxConfig
} from '../../shared/skyux-config';

import {
  SkyuxOpenHostUrlPlugin
} from '../../tools/webpack/plugins/open-host-url/open-host-url.plugin';

import {
  applyAppAssetsWebpackConfig
} from '../../tools/webpack/app-assets-webpack-config';

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
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext,
  skyuxConfig: SkyuxConfig
): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {

    const localUrl = getLocalUrlFromOptions(options);

    webpackConfig.plugins = webpackConfig.plugins || [];

    if (options.skyuxLaunch === 'host') {
      const projectName = context.target!.project!;

      webpackConfig.plugins.push(
        new SkyuxOpenHostUrlPlugin({
          externals: skyuxConfig.app?.externals,
          host: skyuxConfig.host,
          localUrl,
          open: options.skyuxOpen!,
          pathName: projectName
        })
      );
    }

    applyAppAssetsWebpackConfig(webpackConfig, localUrl);

    return webpackConfig;
  };
}

export function getDevServerTransforms(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext,
  skyuxConfig: SkyuxConfig
) {
  return {
    webpackConfiguration: getDevServerWepbackConfigTransformer(options, context, skyuxConfig)
  };
}
