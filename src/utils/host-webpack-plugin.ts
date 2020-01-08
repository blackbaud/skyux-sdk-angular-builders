import * as open from 'open';

import * as webpack from 'webpack';

import {
  SkyBuilderOptions
} from '../builder-options';

import {
  SkyBrowser
} from './browser';

export class SkyHostWebpackPlugin {

  constructor(
    private options: SkyBuilderOptions
  ) {
    this.options.skyux.host = this.options.skyux.host || {};
  }

  public apply(compiler: webpack.Compiler): void {
    let launched = false;
    compiler.hooks.done.tap('SkyHostWebpackPlugin', (stats) => {
      if (launched) {
        return;
      }

      const url = SkyBrowser.getLaunchUrl(this.options, stats);

      console.info(`Launching host URL: ${url}`);

      open(url, {
        app: 'google chrome',
        url: true
      });

      launched = true;
    });
  }
}
