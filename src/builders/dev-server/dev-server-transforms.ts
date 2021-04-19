import { BuilderContext } from '@angular-devkit/architect';
import { ExecutionTransformer } from '@angular-devkit/build-angular';
import { SkyuxConfig } from '@skyux/config';

import { take } from 'rxjs/operators';
import { Configuration as WebpackConfig } from 'webpack';

import { getBaseHref } from '../../shared/context-utils';
import { ensureBaseHref } from '../../shared/url-utils';
import { applyAppAssetsWebpackConfig } from '../../tools/webpack/app-assets-webpack-config';
import { SkyuxOpenHostUrlPlugin } from '../../tools/webpack/plugins/open-host-url/open-host-url.plugin';
import { SkyuxProtractorPlugin } from '../../tools/webpack/plugins/protractor/protractor.plugin';
import { applySkyAppConfigWebpackConfig } from '../../tools/webpack/sky-app-config-webpack-config';

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

    let localUrl = getLocalUrlFromOptions(options);
    const baseHref = getBaseHref(context);

    let assetsBaseUrl: string;
    if (isE2e) {
      // The assets URL is built by combining the base assets URL above with
      // the app's root directory (or baseHref), but in e2e tests the assets files
      // are served directly from the root. We'll need to remove the baseHref from the URL
      // so that asset URLs are built relative to the root rather than
      // the app's root directory.
      assetsBaseUrl = localUrl;
    } else {
      localUrl = ensureBaseHref(localUrl, baseHref);
      assetsBaseUrl = localUrl;
    }

    webpackConfig.plugins = webpackConfig.plugins || [];

    const openHostUrlPlugin = new SkyuxOpenHostUrlPlugin({
      externals: skyuxConfig.app?.externals,
      host: skyuxConfig.host!,
      localUrl,
      open: options.skyuxOpen!,
      baseHref
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

    applyAppAssetsWebpackConfig(webpackConfig, assetsBaseUrl);
    applySkyAppConfigWebpackConfig(
      webpackConfig,
      'serve',
      context.target!.project!
    );

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
