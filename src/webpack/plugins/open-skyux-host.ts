import {
  BuilderContext
} from '@angular-devkit/architect';

import open from 'open';

import {
  Compiler
} from 'webpack';

import {
  SkyuxDevServerBuilderOptions
} from '../../shared/skyux-builder-options';

import {
  getSortedAssets
} from './webpack-stats-utils';

const PLUGIN_NAME = 'open-skyux-host-plugin';

export class OpenSKYUXHostPlugin {

  constructor(
    public options: SkyuxDevServerBuilderOptions,
    public context: BuilderContext
  ) { }

  public apply(compiler: Compiler): void {

    // skyuxOpen = "local" sets NG's first-class "open" option upstream
    if (this.options.skyuxOpen !== 'host') {
      return;
    }

    let opened = false;

    compiler.hooks.done.tap(PLUGIN_NAME, webpackStats => {
      if (opened) {
        return;
      }

      const assets = getSortedAssets(webpackStats.toJson(), false);
      const host = this.options.skyuxHostUrl;
      const local = this.options.skyuxLocalUrl;

      const config = {
        sdkBuilderVersion: '5',
        scripts: assets,
        localUrl: local,
        host: {},
        frameOptions: {}
      };

      const configEncoded = Buffer.from(JSON.stringify(config)).toString('base64');
      const url = `${host}${this.context.target?.project}/?local=true&_cfg=${configEncoded}`;

      this.context.logger.info(`SKY UX Host URL:\n\n${url}`);
      opened = true;

      open(url, {
        app: this.options.skyuxOpenBrowser,
        url: true
      });
    });
  }
}