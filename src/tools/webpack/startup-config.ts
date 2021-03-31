import path from 'path';

import webpack from 'webpack';

export function applyStartupConfigWebpackConfig(
  webpackConfig: webpack.Configuration,
  projectName: string
): void {
  webpackConfig.module!.rules.push({
    enforce: 'pre',
    test: /(\/|\\)__skyux(\/|\\)startupconfig\.json$/,
    use: {
      loader: path.resolve(
        __dirname,
        './loaders/startup-config/startup-config.loader'
      ),
      options: {
        projectName
      }
    }
  });
}
