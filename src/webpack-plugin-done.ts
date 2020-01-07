import * as open from 'open';

import * as webpack from 'webpack';

import {
  SkyBuilderOptions
} from './builder-options';

import {
  SkyBrowser
} from './utils/browser';

export class SkyWebpackPluginDone {

  constructor(
    private options: SkyBuilderOptions
  ) {
    this.options.skyux = this.options.skyux || {};
    this.options.skyux.host = this.options.skyux.host || {};
  }

  public apply(compiler: webpack.Compiler): void {
    let launched = false;
    compiler.hooks.done.tap('SkyWebpackPluginDone', (stats) => {
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
