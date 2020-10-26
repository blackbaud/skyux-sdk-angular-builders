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

  constructor(
    private config: SkyuxOpenHostURLPluginConfig
  ) { }

  public apply(compiler: Compiler): void {
    let opened = false;

    compiler.hooks.done.tap(PLUGIN_NAME, (webpackStats) => {
      if (!opened) {

        const assets = getHostAssets(webpackStats.toJson());

        openHostUrl(
          this.config.hostUrl,
          this.config.pathName,
          {
            localUrl: this.config.localUrl,
            rootElementTagName: 'app-root',
            scripts: assets
          }
        );

        opened = true;
      }
    });
  }
}
