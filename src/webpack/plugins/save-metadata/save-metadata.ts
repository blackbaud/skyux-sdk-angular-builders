import fs from 'fs-extra';

import path from 'path';

import {
  Compiler
} from 'webpack';

import {
  addAssetSourceTap,
  getAssets,
  getFallbackName
} from '../../stats-utils';

const PLUGIN_NAME = 'skyux-save-metadata-plugin';

export class SkyuxSaveMetadataPlugin {

  public apply(compiler: Compiler): void {

    // Add our fallback variable to the bottom of the JS source files.
    addAssetSourceTap(
      PLUGIN_NAME,
      compiler,
      (content, file) => `${content}\nvar ${getFallbackName(file)} = true;`
    );

    // Generates a metadata.json file which is processed by our deployment process.
    // See: https://github.com/blackbaud/skyux-deploy/blob/master/lib/assets.js#L74
    compiler.hooks.done.tap(PLUGIN_NAME, (webpackStats) => {
      const stats = webpackStats.toJson();
      const assets = getAssets(stats, {
        includeFallback: true,
        includeLazyloadedChunks: true
      });

      fs.writeJsonSync(
        path.join(stats.outputPath!, 'metadata.json'),
        assets,
        {
          spaces: 2
        }
      );
    });
  }
}
