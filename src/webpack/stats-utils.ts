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

  const assets: Asset[] = [];
  stats.chunks?.forEach(chunk => {
    if (chunk.initial) {
      const asset: Asset = { name: chunk.files[0] };
      if (includeFallback) {
        asset.fallback = getFallbackName(asset.name);
      }
      assets.push(asset);
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
      if (path.parse(file).ext === '.js') {
        const content = asset.source();
        asset.source = () => assetSourceCallback(content, file);
      }
    }

    return true;
  });
}
