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
  take
} from 'rxjs/operators';

import {
  SkyuxConfig
} from '../../shared/skyux-config';

import {
  SkyuxOpenHostUrlPlugin
} from '../../tools/webpack/plugins/open-host-url/open-host-url.plugin';

import {
  SkyuxProtractorPlugin
} from '../../tools/webpack/plugins/protractor/protractor.plugin';

import {
  applyAppAssetsWebpackConfig
} from '../../tools/webpack/app-assets-webpack-config';

import {
  applySkyuxConfigWebpackConfig
} from '../../tools/webpack/skyux-config-webpack-config';

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
      const openHostUrlPlugin = new SkyuxOpenHostUrlPlugin({
        localUrl,
        open: options.skyuxOpen!,
        pathName: context.target!.project!,
        skyuxConfig
      });

      webpackConfig.plugins.push(
        openHostUrlPlugin
      );

      /**
       * If we're running e2e tests, add the Protractor Webpack plugin.
       */
      const configurationName = context.target!.configuration;
      if (
        configurationName === 'e2e' ||
        configurationName === 'e2eProduction'
      ) {
        webpackConfig.plugins.push(
          new SkyuxProtractorPlugin({
            hostUrlFactory: () => {
              return openHostUrlPlugin.$hostUrl.pipe(take(1)).toPromise();
            }
          })
        );
      }
    }

    applyAppAssetsWebpackConfig(webpackConfig, localUrl);
    applySkyuxConfigWebpackConfig(webpackConfig);

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
