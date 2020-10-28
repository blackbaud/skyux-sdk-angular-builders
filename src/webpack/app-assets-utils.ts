import {
  AngularCompilerPlugin
} from '@ngtools/webpack';

import path from 'path';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  SkyuxAppAssetsPlugin
} from './plugins/app-assets/app-assets.plugin';

export function applyAppAssetsConfig(
  webpackConfig: WebpackConfig,
  options: {
    deployUrl?: string;
  }
): void {
  /* istanbul ignore next line */
  webpackConfig.plugins = webpackConfig.plugins || [];
  webpackConfig.module = webpackConfig.module || { rules: [] };

  const assetBaseUrl = options.deployUrl || '';

  webpackConfig.module.rules.push(
    {
      // Read each TypeScript file before `@ngtools/webpack` gets ahold of them.
      enforce: 'pre',
      test: /\.ts$/,
      use: [
        {
          loader: path.resolve(__dirname, './loaders/app-assets/assets-in-typescript.loader'),
          options: {
            assetBaseUrl
          }
        }
      ]
    },
    {
      test: /\.html$/,
      use: [
        'raw-loader',
        {
          loader: path.resolve(__dirname, './loaders/app-assets/assets-in-html.loader'),
          options: {
            assetBaseUrl
          }
        }
      ]
    }
  );

  /**
   * Allows other Webpack loaders to process component HTML templates.
   * @see https://github.com/angular/angular-cli/issues/15861
   */
  const compilerPlugin = webpackConfig.plugins.find(plugin => plugin instanceof AngularCompilerPlugin);
  if (compilerPlugin) {
    (compilerPlugin as AngularCompilerPlugin).options.directTemplateLoading = false;
  }

  webpackConfig.plugins.push(
    new SkyuxAppAssetsPlugin()
  );
}