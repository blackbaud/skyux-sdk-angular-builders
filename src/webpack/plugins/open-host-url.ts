import open from 'open';

import {
  Compiler
} from 'webpack';

import {
  getSortedAssets
} from '../stats-utils';

const PLUGIN_NAME = 'open-skyux-host-plugin';

interface SkyuxOpenHostURLPluginConfig {
  hostUrl: string;
  localUrl: string;
}

export class SkyuxOpenHostURLPlugin {

  constructor(
    private pathName: string,
    private config: SkyuxOpenHostURLPluginConfig
  ) { }

  public apply(compiler: Compiler): void {
    let opened = false;

    compiler.hooks.done.tap(PLUGIN_NAME, (webpackStats) => {
      if (opened) {
        return;
      }

      const assets = getSortedAssets(webpackStats.toJson(), false);
      const host = this.config.hostUrl;
      const local = this.config.localUrl;

      const config = {
        sdkBuilderVersion: '5',
        scripts: assets,
        localUrl: local,
        host: {},
        frameOptions: {}
      };

      // We need to URL encode the value so that characters such as '+'
      // are properly represented.
      const configEncoded = encodeURIComponent(
        Buffer.from(JSON.stringify(config)).toString('base64')
      );

      const url = `${host}${this.pathName}/?local=true&_cfg=${configEncoded}`;

      console.log(`SKY UX Host URL:\n\n${url}`);

      opened = true;

      open(url, {
        url: true
      });
    });
  }
}
