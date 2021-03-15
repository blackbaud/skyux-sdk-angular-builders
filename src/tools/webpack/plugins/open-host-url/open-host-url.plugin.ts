import open from 'open';

import {
  Compiler
} from 'webpack';

import {
  getHostAssets
} from '../../host-asset-utils';

import {
  createHostUrl
} from './create-host-url';

import {
  SkyuxCreateHostUrlConfig
} from './create-host-url-config';

import {
  SkyuxOpenHostUrlPluginConfig
} from './open-host-url-config';

const PLUGIN_NAME = 'open-skyux-host-plugin';

export class SkyuxOpenHostUrlPlugin {

  constructor(
    private config: SkyuxOpenHostUrlPluginConfig
  ) { }

  public apply(compiler: Compiler): void {
    let opened = false;

    compiler.hooks.done.tap(PLUGIN_NAME, (webpackStats) => {
      if (!opened) {

        const assets = getHostAssets(webpackStats.toJson());

        const hostUrlConfig: SkyuxCreateHostUrlConfig = {
          host: this.config.host,
          localUrl: this.config.localUrl,
          rootElementTagName: 'app-root',
          scripts: assets
        };

        if (this.config.externals) {
          hostUrlConfig.externals = this.config.externals;
        }

        const url = createHostUrl(
          this.config.host.url,
          this.config.pathName,
          hostUrlConfig
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
