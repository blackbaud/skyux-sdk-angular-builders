import {
  Compiler
} from 'webpack';

import {
  SkyuxHostUrlConfig
} from '../../../shared/host-url-config';

import {
  openHostUrl
} from '../../../shared/host-utils';

import {
  getHostAssets
} from '../../host-asset-utils';

import {
  getRootElementTagName
} from '../../root-element-utils';

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
      const config: SkyuxHostUrlConfig = {
        localUrl: this.config.localUrl,
        rootElementTagName: getRootElementTagName(),
        scripts: assets
      };

        openHostUrl(
          this.config.hostUrl,
          this.config.pathName,
          config
        );

        opened = true;
      }
    });
  }
}
