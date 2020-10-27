import {
  BuilderContext
} from '@angular-devkit/architect';

import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  AngularCompilerPlugin
} from '@ngtools/webpack';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  getAssetUrlsLoaderRules
} from '../../webpack/loaders/asset-urls/asset-urls-loader-rules';

import {
  SkyuxAssetUrlsPlugin
} from '../../webpack/plugins/asset-urls/asset-urls.plugin';

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
 * Allows other Webpack loaders to process component HTML templates.
 * @see https://github.com/angular/angular-cli/issues/15861
 */
function unlockComponentTemplates(webpackConfig: WebpackConfig): void {
  const compilerPlugin = webpackConfig.plugins?.find(plugin => plugin instanceof AngularCompilerPlugin);
  (compilerPlugin as AngularCompilerPlugin).options.directTemplateLoading = false;
}

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

    webpackConfig.plugins = webpackConfig.plugins || [];
    webpackConfig.module = webpackConfig.module || { rules: [] };

    if (options.skyuxLaunch === 'host') {
      /*istanbul ignore next line*/
      const pathName = context.target?.project!;
      const assetBaseUrl = options.deployUrl!;

      webpackConfig.plugins.push(
        new SkyuxOpenHostURLPlugin({
          hostUrl: options.skyuxHostUrl!,
          localUrl: getLocalUrlFromOptions(options),
          pathName
        })
      );

      webpackConfig.plugins.push(
        new SkyuxAssetUrlsPlugin()
      );

      webpackConfig.module.rules.push(
        ...getAssetUrlsLoaderRules(assetBaseUrl)
      );

      unlockComponentTemplates(webpackConfig);
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
