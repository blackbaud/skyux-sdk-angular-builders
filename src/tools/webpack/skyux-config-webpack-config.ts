import path from 'path';

import webpack from 'webpack';

export function applySkyuxConfigWebpackConfig(
  webpackConfig: webpack.Configuration
): void {
  webpackConfig.module!.rules.push({
    enforce: 'pre',
    test: /(\/|\\)__skyux(\/|\\)processed-skyuxconfig\.json$/,
    use: {
      loader: path.resolve(
        __dirname,
        './loaders/skyux-config/skyux-config.loader'
      )
    }
  });
}
