import fs from 'fs-extra';

import path from 'path';

import { Compiler } from 'webpack';

import { getHostAssets } from '../../host-asset-utils';

const PLUGIN_NAME = 'skyux-save-host-metadata-plugin';

/**
 * Generates a metadata.json file which is processed by our deployment process.
 * @see: https://github.com/blackbaud/skyux-deploy/blob/master/lib/assets.js#L74
 */
export class SkyuxSaveHostMetadataPlugin {
  public apply(compiler: Compiler): void {
    compiler.hooks.done.tap(PLUGIN_NAME, (webpackStats) => {
      const stats = webpackStats.toJson();
      const assets = getHostAssets(stats, {
        includeFallback: true,
        includeLazyloadedChunks: true
      });

      fs.writeJsonSync(
        path.join(stats.outputPath!, 'metadata.json'),
        assets.scripts.concat(assets.stylesheets),
        {
          spaces: 2
        }
      );
    });
  }
}
