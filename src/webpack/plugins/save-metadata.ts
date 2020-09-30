import fs from 'fs-extra';

import path from 'path';

import {
  Compiler
} from 'webpack';

import {
  addAssetSourceTap,
  getFallbackName,
  getSortedAssets
} from '../stats-utils';

const PLUGIN_NAME = 'save-metadata-plugin';

export class SkyuxSaveMetadataPlugin {

  public apply(compiler: Compiler): void {

    addAssetSourceTap(
      PLUGIN_NAME,
      compiler,
      (content, file) => `${content}\nvar ${getFallbackName(file)} = true;`
    );

    compiler.hooks.done.tap(PLUGIN_NAME, (webpackStats) => {

      const stats = webpackStats.toJson();
      const assets = getSortedAssets(stats, true);

      fs.writeFileSync(
        path.join(stats?.outputPath as string, 'metadata.json'),
        JSON.stringify(assets, null, '\t')
      );
    });

  }

}
