import path from 'path';

import {
  RuleSetRule
} from 'webpack';

export function getAssetUrlsLoaderRule(
  assetBaseUrl: string
): RuleSetRule {

  const rule: RuleSetRule = {
    enforce: 'pre',
    test: /\.ts$/,
    use: {
      loader: path.resolve(__dirname, './assets-in-ts'),
      options: {
        assetBaseUrl
      }
    }
  };

  return rule;
}
