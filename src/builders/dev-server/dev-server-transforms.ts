import {
  BuilderContext
} from '@angular-devkit/architect';

import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

// import {
//   AngularCompilerPlugin
// } from '@ngtools/webpack';

import path from 'path';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  SkyuxAssetUrlsPlugin
} from '../../webpack/plugins/asset-urls/asset-urls';

import {
  SkyuxOpenHostURLPlugin
} from '../../webpack/plugins/open-host-url/open-host-url';

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
  return (webpackConfig) => {

    if (options.skyuxLaunch === 'host') {

      webpackConfig.module?.rules?.push({
        enforce: 'pre',
        test: /\.ts$/,
        use: {
          loader: path.resolve(__dirname, '../../webpack/loaders/asset-urls/assets-in-ts'),
          options: {
            baseUrl: options.deployUrl
          }
        }
      });

      // webpackConfig.module?.rules?.push({
      //   test: /\.html$/,
      //   use: [
      //     'raw-loader',
      //     {
      //       loader: path.resolve(__dirname, '../../webpack/loaders/asset-urls/assets-in-html'),
      //       options: {
      //         baseUrl: options.deployUrl
      //       }
      //     }
      //   ]
      // });

      /*istanbul ignore next line*/
      const pathName = context.target?.project!;

      if (!webpackConfig.plugins) {
        webpackConfig.plugins = [];
      }

      webpackConfig.plugins.push(
        new SkyuxAssetUrlsPlugin(),
        new SkyuxOpenHostURLPlugin({
          hostUrl: options.skyuxHostUrl!,
          localUrl: getLocalUrlFromOptions(options),
          pathName
        })
      );

      // Allows our HTML loader to process the HTML templates.
      // const compilerPlugin = webpackConfig.plugins?.find(plugin => plugin instanceof AngularCompilerPlugin);
      // (compilerPlugin as AngularCompilerPlugin).options.directTemplateLoading = false;
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
