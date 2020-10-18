import fs from 'fs-extra';

import path from 'path';

import {
  Compiler
} from 'webpack';

import {
  getRootElementTagName
} from '../../root-element-utils';

const PLUGIN_NAME = 'skyux-save-metadata-plugin';

export class SkyuxWriteSkyuxConfigPlugin {

  public apply(compiler: Compiler): void {

    // Generates a skyuxconfig.json file which is processed by our deployment process.
    // See: https://github.com/blackbaud/skyux-deploy/blob/master/lib/settings.js#L31
    compiler.hooks.done.tap(PLUGIN_NAME, (webpackStats) => {
      const stats = webpackStats.toJson();

      const skyuxConfig = {
        rootElementTagName: getRootElementTagName()
      };

      fs.writeJsonSync(
        path.join(stats.outputPath!, 'skyuxconfig.json'),
        skyuxConfig,
        {
          spaces: 2
        }
      );

    });
  }

}
