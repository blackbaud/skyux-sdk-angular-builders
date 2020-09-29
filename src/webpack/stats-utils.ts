import path from 'path';

import {
  Compiler,
  Stats
} from 'webpack';

interface Asset {
  fallback?: string;
  name: string;
}

type AssetEntry = [string, any];

export type AssetSourceCallback = (content: string, file: string) => void;

export function getFallbackName(name: string): string {
  return `SKY_PAGES_READY_${name.toUpperCase().replace(/\./g, '_')}`;
}

export function getSortedAssets(
  stats: Stats.ToJsonOutput,
  includeFallback: boolean
): Asset[] {

  if (!stats) {
    return [];
  }

  // TODO: figure out if this doesn't have to be manually sorted!
  // Response: Doesn't look like order is important.
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

  // THIS LOGIC IS AN ATTEMPT TO USE LAZY MODULE LOADING.
  // let assets: Asset[] = [];
  // if (stats.chunks) {
  //   assets = stats.chunks?.map(c => {
  //     const chunk = stats.assetsByChunkName && stats.assetsByChunkName[c.id];
  //     const name = Array.isArray(chunk) ? chunk[0] : chunk;
  //     const asset: Asset = {
  //       name: name as string
  //     };

  //     if (includeFallback) {
  //       asset.fallback = getFallbackName(name as string);
  //     }

  //     return asset;
  //   });
  // }

  // return assets;
}

export function addAssetSourceTap(
  pluginName: string,
  compiler: Compiler,
  assetSourceCallback: AssetSourceCallback
): void {

  compiler.hooks.emit.tap(pluginName, compilation => {

    const assets: AssetEntry[] = Object.entries(compilation.assets)

    for (const [file, asset] of assets) {
      if (path.parse(file).ext === '.js') {
        const content = asset.source();
        asset.source = () => assetSourceCallback(content, file);
      }
    }

    return true;
  });
}
