import open from 'open';

import {
  Compiler
} from 'webpack';

import {
  createHostUrl
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

        const url = createHostUrl(
          this.config.hostUrl,
          this.config.pathName,
          {
            localUrl: this.config.localUrl,
            rootElementTagName: 'app-root',
            scripts: assets
          }
        );

        console.log(`\nSKY UX Host URL:\n\n${url}`);

        if (this.config.open) {
          open(url);
        }

        opened = true;
      }
    });
  }
}
