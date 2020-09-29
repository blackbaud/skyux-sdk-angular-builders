import {
  BuilderContext
} from '@angular-devkit/architect';

import open from 'open';

import path from 'path';

import {
  Compiler
} from 'webpack';

import {
  SkyuxDevServerBuilderOptions
} from './dev-server-options';

interface Asset {
  fallback?: string;
  name: string;
}

function getFallbackName(name: string): string {
  return `SKY_PAGES_READY_${name.toUpperCase().replace(/\./g, '_')}`;
}

function getSortedAssets(
  stats: any,
  includeFallback: boolean
): Asset[] {

  // TODO: figure out if this doesn't have to be manually sorted!
  const order = [
    'runtime',
    'polyfills',
    'styles',
    'vendor',
    'main'
  ];

  const assets: Asset[] = [];

  order.forEach(id => {
    if (stats.assetsByChunkName[id]) {
      const chunk = stats.assetsByChunkName[id];
      const name = Array.isArray(chunk) ? chunk[0] : chunk;

      // TODO: change this to JS | CSS when Host is ready
      if (path.parse(name).ext === '.js') {
        const asset: Asset = { name };
        if (includeFallback) {
          asset.fallback = getFallbackName(name);
        }
        assets.push(asset);
      }
    }
  });

  return assets;
}

const PLUGIN_NAME = 'open-skyux-host-plugin';

export class SkyuxOpenHostURLPlugin {

  constructor(
    public options: SkyuxDevServerBuilderOptions,
    public context: BuilderContext
  ) { }

  public apply(compiler: Compiler): void {
    if (this.options.skyuxOpen !== 'host') {
      return;
    }

    let opened = false;

    compiler.hooks.done.tap(PLUGIN_NAME, (webpackStats) => {
      if (opened) {
        return;
      }

      const assets = getSortedAssets(webpackStats.toJson(), false);
      const host = this.options.skyuxHostUrl;
      const local = this.options.skyuxLocalUrl;

      const config = {
        sdkBuilderVersion: '5',
        scripts: assets,
        localUrl: local,
        host: {},
        frameOptions: {}
      };

      const configEncoded = Buffer.from(JSON.stringify(config)).toString('base64');
      const url = `${host}${this.context.target?.project}/?local=true&_cfg=${configEncoded}`;

      this.context.logger.info(`SKY UX Host URL:\n\n${url}`);
      opened = true;

      open(url, {
        app: this.options.skyuxOpenBrowser,
        url: true
      });
    });
  }
}
