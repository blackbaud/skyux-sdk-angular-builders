import { ExecutionTransformer } from '@angular-devkit/build-angular';

import path from 'path';
import { Configuration as WebpackConfig, DefinePlugin } from 'webpack';

/**
 * Allows adjustments to the default Angular "dev-server" webpack config.
 * @param options The input options passed to the builder.
 * @param context The context of the builder execution.
 */
function getKarmaWepbackConfigTransformer(): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {
    webpackConfig.plugins = webpackConfig.plugins || [];
    webpackConfig.module = webpackConfig.module || {
      rules: []
    };

    webpackConfig.module.rules.push({
      enforce: 'pre',
      test: /skyux-i18n-testing\.js$/,
      use: {
        loader: path.resolve(
          __dirname,
          '../../tools/webpack/loaders/fix-require-context/fix-require-context.loader'
        )
      }
    });

    /**
     * Sets the global variable `ROOT_DIR` to be used by `SkyAppResourcesTestService`.
     * @see: https://github.com/blackbaud/skyux-i18n/blob/master/src/app/public/testing/resources-test.service.ts#L19
     */
    const rootDir = JSON.stringify(path.resolve(process.cwd(), 'src/app'));
    webpackConfig.plugins.unshift(
      new DefinePlugin({
        ROOT_DIR: rootDir
      })
    );

    return webpackConfig;
  };
}

export function getKarmaTransforms() {
  return {
    webpackConfiguration: getKarmaWepbackConfigTransformer()
  };
}
