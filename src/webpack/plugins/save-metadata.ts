import {
  writeFileSync
} from 'fs';

import {
  join,
} from 'path';

import {
  Compiler
} from 'webpack';

import {
  Logger
} from '../../shared/logger';

import {
  getFallbackName,
  getSortedAssets,
  addAssetSourceTap
} from './webpack-stats-utils';

const PLUGIN_NAME = 'save-metadata-plugin';

export class SaveMetadataPlugin {

  apply(compiler: Compiler) {

    addAssetSourceTap(
      PLUGIN_NAME,
      compiler,
      (content, file) => `${content}\nvar ${getFallbackName(file)} = true;`
    );
  
    compiler.hooks.done.tap(PLUGIN_NAME, webpackStats => {
  
      const stats = webpackStats.toJson();
      const assets = getSortedAssets(stats, true);
  
      writeFileSync(
        join(stats.outputPath, 'metadata.json'),
        JSON.stringify(assets, null, '\t')
      );
      
      // TODO Probably move this to a dedicated plugin, or rename it
      Logger.flush();
    });
  }
}