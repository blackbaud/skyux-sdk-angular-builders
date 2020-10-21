import {
  Compiler
} from 'webpack';

import {
  openHostUrl
} from '../../../shared/host-utils';

import {
  getHostAssets
} from '../../host-asset-utils';

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
      if (!opened) {

        const assets = getHostAssets(webpackStats.toJson());

        openHostUrl(
          this.config.hostUrl,
          this.pathName,
          {
            localUrl: this.config.localUrl,
            scripts: assets
          }
        );

        opened = true;
      }
    });
  }
}
