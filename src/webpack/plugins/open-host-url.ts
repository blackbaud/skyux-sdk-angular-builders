import open from 'open';

import {
  Compiler
} from 'webpack';

import {
  getAssets
} from '../stats-utils';

const PLUGIN_NAME = 'open-skyux-host-plugin';

interface SkyuxOpenHostURLPluginConfig {

  /**
   * The URL of the SKY UX Host server.
   */
  hostUrl: string;

  /**
   * The URL of the localhost server, serving the asset files.
   */
  localUrl: string;
}

/**
 * Configuration that is passed to the SKY UX Host server.
 */
interface SkyuxHostConfig {

  /**
   * An array of JavaScript file names to inject into Host's index.html file.
   */
  scripts: {
    name: string;
  }[];

  /**
   * The URL of the localhost server, serving the asset files.
   */
  localUrl: string;
}

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

      const assets = getAssets(webpackStats.toJson(), false);
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
