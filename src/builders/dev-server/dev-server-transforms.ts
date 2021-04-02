import { BuilderContext } from '@angular-devkit/architect';

import { ExecutionTransformer } from '@angular-devkit/build-angular';

import { Configuration as WebpackConfig } from 'webpack';

import { take } from 'rxjs/operators';

import { SkyuxConfig } from '../../shared/skyux-config';

import { SkyuxOpenHostUrlPlugin } from '../../tools/webpack/plugins/open-host-url/open-host-url.plugin';

import { SkyuxProtractorPlugin } from '../../tools/webpack/plugins/protractor/protractor.plugin';

import { applyAppAssetsWebpackConfig } from '../../tools/webpack/app-assets-webpack-config';

import { applySkyuxConfigWebpackConfig } from '../../tools/webpack/skyux-config-webpack-config';

import { applyStartupConfigWebpackConfig } from '../../tools/webpack/startup-config';

import { SkyuxDevServerBuilderOptions } from './dev-server-options';

import { getLocalUrlFromOptions } from './dev-server-utils';

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
    const configurationName = context.target!.configuration;
    const isE2e =
      configurationName === 'e2e' || configurationName === 'e2eProduction';

    const projectName = context.target!.project!;
    const assetsBaseUrl = options.deployUrl || '';

    let localUrl = getLocalUrlFromOptions(options);
    let baseHref: string;
    if (isE2e) {
      // The assets URL is built by combining the base assets URL above with
      // the app's root directory (or baseHref), but in e2e tests the assets files
      // are served directly from the root. We'll need to remove the baseHref from the URL
      // so that asset URLs are built relative to the root rather than
      // the app's root directory.
      baseHref = '';
    } else {
      baseHref = projectName;
      localUrl += baseHref;
    }

    webpackConfig.plugins = webpackConfig.plugins || [];

    const openHostUrlPlugin = new SkyuxOpenHostUrlPlugin({
      externals: skyuxConfig.app?.externals,
      host: skyuxConfig.host,
      localUrl,
      open: options.skyuxOpen!,
      baseHref: projectName
    });

    webpackConfig.plugins.push(openHostUrlPlugin);

    /**
     * If we're running e2e tests, add the Protractor Webpack plugin.
     */
    if (isE2e) {
      webpackConfig.plugins.push(
        new SkyuxProtractorPlugin({
          hostUrlFactory: () => {
            return openHostUrlPlugin.$hostUrl.pipe(take(1)).toPromise();
          }
        })
      );
    }

    applyAppAssetsWebpackConfig(webpackConfig, assetsBaseUrl, baseHref);
    applySkyuxConfigWebpackConfig(webpackConfig);
    applyStartupConfigWebpackConfig(webpackConfig, projectName);

    return webpackConfig;
  };
}

export function getDevServerTransforms(
  options: SkyuxDevServerBuilderOptions,
  context: BuilderContext,
  skyuxConfig: SkyuxConfig
) {
  return {
    webpackConfiguration: getDevServerWepbackConfigTransformer(
      options,
      context,
      skyuxConfig
    )
  };
}
