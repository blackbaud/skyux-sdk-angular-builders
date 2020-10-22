// This plugin is a compromise from not having access to manipulate TS files in the webpack loader chain
// versus having to copy the src directory, manipulate the files on disk, and point the build to it instead.
// If the Angular team does decide to expose that functionality first-class, this plugin would be obsolete.

import {
  Compiler
} from 'webpack';

import {
  AssetState
} from '../../../shared/asset-state';

import {
  addAssetSourceTap
} from '../../webpack-stats-utils';

const PLUGIN_NAME = 'skyux-asset-urls-plugin';

export class SkyuxAssetUrlsPlugin {
  apply(compiler: Compiler) {
    addAssetSourceTap(
      PLUGIN_NAME,
      compiler,
      (content: string) => {
        return AssetState.replaceAssetPaths(content)
      }
    );
  }
}
