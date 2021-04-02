import { createAppAssetsMap } from '../../shared/app-assets-utils';
import { SkyuxAppAssetsPlugin } from './plugins/app-assets/app-assets.plugin';
import path from 'path';
import webpack from 'webpack';

export function applyAppAssetsWebpackConfig(
  webpackConfig: webpack.Configuration,
  assetsBaseUrl: string,
  baseHref: string
): void {
  const assetsMap = createAppAssetsMap(assetsBaseUrl, baseHref);
  const processedAssetsMap: { [_: string]: string } = {};
  for (const [relativeUrl, asset] of Object.entries(assetsMap)) {
    processedAssetsMap[relativeUrl.replace('assets/', '')] = asset.hashedUrl;
  }

  webpackConfig.module = webpackConfig.module || {
    rules: []
  };

  webpackConfig.module.rules.push({
    enforce: 'pre',
    test: /(\/|\\)__skyux(\/|\\)app-assets-map\.json$/,
    use: {
      loader: path.resolve(__dirname, './loaders/app-assets/app-assets.loader'),
      options: {
        assetsMapStringified: JSON.stringify(processedAssetsMap)
      }
    }
  });

  webpackConfig.plugins!.push(
    new SkyuxAppAssetsPlugin({
      assetsMap
    })
  );
}
