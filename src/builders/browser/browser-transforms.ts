import { BuilderContext } from '@angular-devkit/architect';

import { ExecutionTransformer } from '@angular-devkit/build-angular';

import { Configuration as WebpackConfig } from 'webpack';

import { SkyuxHostAssetsFallbackPlugin } from '../../tools/webpack/plugins/host-assets-fallback/host-assets-fallback.plugin';

import { SkyuxSaveHostMetadataPlugin } from '../../tools/webpack/plugins/save-host-metadata/save-host-metadata.plugin';

import { applyAppAssetsWebpackConfig } from '../../tools/webpack/app-assets-webpack-config';

import { applySkyuxConfigWebpackConfig } from '../../tools/webpack/skyux-config-webpack-config';

import { applyStartupConfigWebpackConfig } from '../../tools/webpack/startup-config';

import { SkyuxBrowserBuilderOptions } from './browser-options';

/**
 * Allows adjustments to the default Angular "browser" webpack config.
 * @param options The input options passed to the builder.
 * @param context The context of the builder execution.
 */
function getBrowserWepbackConfigTransformer(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {
    const projectName = context.target!.project!;

    webpackConfig.plugins =
      webpackConfig.plugins || [];

    webpackConfig.plugins.push(
      new SkyuxHostAssetsFallbackPlugin(),
      new SkyuxSaveHostMetadataPlugin()
    );

    applyAppAssetsWebpackConfig(
      webpackConfig,
      options.deployUrl!,
      projectName
    );
    applySkyuxConfigWebpackConfig(webpackConfig);
    applyStartupConfigWebpackConfig(
      webpackConfig,
      projectName
    );

    return webpackConfig;
  };
}

export function getBrowserTransforms(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
) {
  return {
    webpackConfiguration: getBrowserWepbackConfigTransformer(
      options,
      context
    )
  };
}
