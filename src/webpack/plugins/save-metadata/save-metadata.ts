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

const PLUGIN_NAME = 'save-metadata-plugin';

export class SkyuxSaveMetadataPlugin {

  public apply(compiler: Compiler): void {

    // Add our fallback variable to the bottom of the JS source files.
    // The "fallback" variable references something with asp-fallback in SKY UX Host.
    // See: https://docs.microsoft.com/en-us/aspnet/core/mvc/views/tag-helpers/built-in/link-tag-helper?view=aspnetcore-3.1
    // TODO: Ask Bobby/Terry where the fallback source is kept.
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
        includeLazyloadedChunks: true // TODO: Do we need to deliniate between entry/lazy-loaded?
      });

      fs.writeFileSync(
        path.join(stats?.outputPath!, 'metadata.json'),
        JSON.stringify(assets, null, '\t')
      );
    });
  }
}
