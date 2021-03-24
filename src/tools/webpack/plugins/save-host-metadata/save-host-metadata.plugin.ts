import fs from 'fs-extra';

import path from 'path';

import {
  Compiler
} from 'webpack';

import {
  getFallbackTestCssRule,
  getFallbackTestVariable,
  getHostAssets
} from '../../host-asset-utils';

import {
  modifyScriptContents,
  modifyStylesheetContents
} from '../../webpack-utils';

const PLUGIN_NAME = 'skyux-save-host-metadata-plugin';

export class SkyuxSaveHostMetadataPlugin {
  public apply(compiler: Compiler): void {

    // Add our fallback variable to the bottom of the JS source files.
    compiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {
      modifyScriptContents(
        compilation,
        (content, file) => `${content}\nvar ${getFallbackTestVariable(file)} = true;`
      );
    });

    // Add our fallback class name to each CSS file.
    compiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {
      modifyStylesheetContents(
        compilation,
        (content, file) => `${content}\n${getFallbackTestCssRule(file)}`
      );
    });

    // Generates a metadata.json file which is processed by our deployment process.
    // See: https://github.com/blackbaud/skyux-deploy/blob/master/lib/assets.js#L74
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
