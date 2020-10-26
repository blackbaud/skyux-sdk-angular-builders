// import path from 'path';

import {
  RuleSetRule
} from 'webpack';

export function getAssetUrlsLoaderRules(
  _assetBaseUrl: string
): RuleSetRule[] {

  return [];

  // const rules: RuleSetRule[] = [
  //   {
  //     enforce: 'pre',
  //     test: /\.ts$/,
  //     use: {
  //       loader: path.resolve(__dirname, './assets-in-typescript-loader'),
  //       options: {
  //         assetBaseUrl
  //       }
  //     }
  //   },
  //   {
  //     test: /.html$/,
  //     use: [
  //       'raw-loader',
  //       {
  //         loader: path.resolve(__dirname, './assets-in-html-loader'),
  //         options: {
  //           assetBaseUrl
  //         }
  //       }
  //     ]
  //   }
  // ];

  // return rules;
}
