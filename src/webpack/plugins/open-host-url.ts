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

interface SkyuxHostConfig {
  scripts: {
    name: string;
  }[];
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
      const config: SkyuxHostConfig = {
        localUrl: this.config.localUrl,
        scripts: assets
      };

      // We need to URL encode the value so that characters such as '+'
      // are properly represented.
      const configEncoded = encodeURIComponent(
        Buffer.from(JSON.stringify(config)).toString('base64')
      );

      const url = `${this.config.hostUrl}${this.pathName}/?local=true&_cfg=${configEncoded}`;

      console.log(`SKY UX Host URL:\n\n${url}`);

      opened = true;

      open(url);
    });
  }
}
