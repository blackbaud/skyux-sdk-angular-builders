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
  SkyuxAssetUrlsPlugin
} from '../../webpack/plugins/asset-urls/asset-urls-plugin';

import {
  SkyuxOpenHostURLPlugin
} from '../../webpack/plugins/open-host-url/open-host-url-plugin';

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
  context: BuilderContext
): ExecutionTransformer<WebpackConfig> {
  return (config) => {

    config.plugins = config.plugins || [];
    config.module = config.module || { rules: [] };

    if (options.skyuxLaunch === 'host') {

      const assetBaseUrl = options.deployUrl!;
      const pathName = context.target!.project!;

      config.plugins.push(
        new SkyuxAssetUrlsPlugin({
          assetBaseUrl
        }),
        new SkyuxOpenHostURLPlugin({
          hostUrl: options.skyuxHostUrl!,
          localUrl: getLocalUrlFromOptions(options),
          pathName
        })
      );

      // Allows our HTML loader to process the HTML templates.
      // const compilerPlugin = config.plugins?.find(plugin => plugin instanceof AngularCompilerPlugin);
      // (compilerPlugin as AngularCompilerPlugin).options.directTemplateLoading = false;
    }

    return config;
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
