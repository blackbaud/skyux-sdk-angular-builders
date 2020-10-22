import path from 'path';

import {
  RuleSetRule
} from 'webpack';

export function getAssetUrlsLoaderConfig(baseUrl: string): RuleSetRule {
  const rule: RuleSetRule = {
    enforce: 'pre',
    test: /\.ts$/,
    use: {
      loader: path.resolve(__dirname, './loaders/asset-urls/assets-in-ts'),
      options: {
        baseUrl
      }
    }
  };

  return rule;
}
