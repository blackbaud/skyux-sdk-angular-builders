import path from 'path';

import webpack from 'webpack';

export function applySkyuxconfigWebpackConfig(
  webpackConfig: webpack.Configuration,
  skyuxconfig: {
    host?: {
      url?: string;
    }
  }
): void {
  const skyuxconfigStringified = JSON.stringify(skyuxconfig);

  webpackConfig.module?.rules.push({
    test: /(\/|\\)\.skyuxconfig\.ts$/,
    use: {
      loader: path.resolve(__dirname, '../../webpack/loaders/skyuxconfig/skyuxconfig.loader'),
      options: {
        skyuxconfigStringified
      }
    }
  });
}
