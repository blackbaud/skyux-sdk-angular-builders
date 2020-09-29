import open from 'open';

import path from 'path';

import {
  Compiler,
  Stats
} from 'webpack';

interface Asset {
  fallback?: string;
  name: string;
}

function getFallbackName(name: string): string {
  return `SKY_PAGES_READY_${name.toUpperCase().replace(/\./g, '_')}`;
}

function getSortedAssets(
  stats: Stats.ToJsonOutput,
  includeFallback: boolean
): Asset[] {

  if (!stats) {
    return [];
  }

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
    if (stats.assetsByChunkName && stats.assetsByChunkName[id]) {
      const chunk = stats.assetsByChunkName[id];
      const name = Array.isArray(chunk) ? chunk[0] : chunk;
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

interface SkyuxOpenHostURLPluginConfig {
  browser?: string | string[];
  hostUrl: string;
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
      const host = this.config.hostUrl;
      const local = this.config.localUrl;

      const config = {
        sdkBuilderVersion: '5',
        scripts: assets,
        localUrl: local,
        host: {},
        frameOptions: {}
      };

      const configEncoded = Buffer.from(JSON.stringify(config)).toString('base64');

      const url = `${host}${this.pathName}/?local=true&_cfg=${configEncoded}`;

      console.log(`SKY UX Host URL:\n\n${url}`);

      opened = true;

      open(url, {
        app: this.config.browser,
        url: true
      });
    });
  }
}
