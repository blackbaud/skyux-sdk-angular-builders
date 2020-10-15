import open from 'open';

import {
  Compiler
} from 'webpack';

import {
  getAssets
} from '../../stats-utils';

import {
  SkyuxHostConfig
} from './host-config';

import {
  SkyuxOpenHostURLPluginConfig
} from './open-host-url-config';

const PLUGIN_NAME = 'open-skyux-host-plugin';

export class SkyuxOpenHostURLPlugin {

  /**
   * @param pathName The unique pathname of the SPA, e.g. 'my-spa'.
   * @param config Additional configuration.
   */
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

      const assets = getAssets(webpackStats.toJson());
      const config: SkyuxHostConfig = {
        host: {
          rootElementTagName: 'app-root'
        },
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
