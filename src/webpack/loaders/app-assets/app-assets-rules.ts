import path from 'path';

import {
  RuleSetRule
} from 'webpack';

export function getAppAssetsRules(
  assetBaseUrl: string
): RuleSetRule[] {

  const rules: RuleSetRule[] = [
    {
      // Read each TypeScript file before `@ngtools/webpack` gets ahold of them.
      enforce: 'pre',
      test: /\.ts$/,
      use: {
        loader: path.resolve(__dirname, './assets-in-typescript.loader'),
        options: {
          assetBaseUrl
        }
      }
    },
    {
      test: /\.html$/,
      use: [
        'raw-loader',
        {
          loader: path.resolve(__dirname, './assets-in-html.loader'),
          options: {
            assetBaseUrl
          }
        }
      ]
    }
  ];

  return rules;
}
