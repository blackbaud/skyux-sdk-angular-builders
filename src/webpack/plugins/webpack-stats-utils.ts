import {
  parse
} from 'path';

import {
  Compiler
} from 'webpack';

type AssetEntry = [string, any];

export interface Asset {
  name: string;
  fallback?: string;
}

export type AssetSourceCallback = (content: string, file: string) => void;

export function getFallbackName(name: string) {
  return `SKY_PAGES_READY_${name.toUpperCase().replace(/\./g, '_')}`;
}

export function getSortedAssets(
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
      if (parse(name).ext === '.js') {
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

export function addAssetSourceTap(
  pluginName: string,
  compiler: Compiler,
  assetSourceCallback: AssetSourceCallback
): void {

  compiler.hooks.emit.tap(pluginName, compilation => {

    const assets: AssetEntry[] = Object.entries(compilation.assets)

    for (const [file, asset] of assets) {
      if (parse(file).ext === '.js') {
        const content = asset.source();
        asset.source = () => assetSourceCallback(content, file);
      }
    }

    return true;
  });
}
