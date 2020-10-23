import path from 'path';

import {
  RuleSetRule
} from 'webpack';
import { SkyuxAssetService } from '../../../shared/asset-service';

export function getAssetUrlsLoaderRule(
  assetBaseUrl: string,
  assetService: SkyuxAssetService
): RuleSetRule {

  const rule: RuleSetRule = {
    enforce: 'pre',
    test: /\.ts$/,
    use: {
      loader: path.resolve(__dirname, './assets-in-ts'),
      options: {
        assetBaseUrl,
        assetService
      }
    }
  };

  return rule;
}
