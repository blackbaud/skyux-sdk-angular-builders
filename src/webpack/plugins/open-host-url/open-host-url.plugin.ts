import open from 'open';

import {
  Compiler
} from 'webpack';

import {
  applyProtractorEnvironmentConfig
} from '../../../builders/protractor/protractor-environment-utils';

import {
  getHostAssets
} from '../../host-asset-utils';

import {
  SkyuxConfigHost
} from './config-host';

import {
  createHostUrl
} from './create-host-url';
import { SkyuxHostUrlConfig } from './host-url-config';

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

        const hostConfig: SkyuxConfigHost = {
          url: this.config.hostUrl
        };

        if (this.config.bbCheckout) {
          hostConfig.bbCheckout = this.config.bbCheckout;
        }

        if (this.config.frameOptions) {
          hostConfig.frameOptions = this.config.frameOptions;
        }

        const hostUrlConfig: SkyuxHostUrlConfig = {
          localUrl: this.config.localUrl,
          rootElementTagName: 'app-root',
          scripts: assets,
          host: hostConfig
        };

        if (this.config.externals) {
          hostUrlConfig.externals = this.config.externals;
        }

        const url = createHostUrl(
          this.config.hostUrl,
          this.config.pathName,
          hostUrlConfig
        );

        console.log(`\nSKY UX Host URL:\n\n${url}`);

        // TODO: Better place to capture this?
        applyProtractorEnvironmentConfig({
          skyuxHostUrl: url
        });

        if (this.config.open) {
          open(url);
        }

        opened = true;
      }
    });
  }
}
