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

type AssetSourceCallback = (content: string, file: string) => void;

export function getFallbackName(name: string): string {
  return `SKY_PAGES_READY_${name.toUpperCase().replace(/\./g, '_')}`;
}

export function getAssets(
  stats: Stats.ToJsonOutput,
  config?: {
    includeFallback?: boolean;
    includeLazyloadedChunks?: boolean;
  }
): Asset[] {
  const assets: Asset[] = [];

  stats?.chunks?.forEach(chunk => {
    console.log('CHUNK:', chunk.files);
    if (chunk.initial && !config?.includeLazyloadedChunks) {
      const asset: Asset = {
        name: chunk.files[0]
      };

      if (config?.includeFallback) {
        asset.fallback = getFallbackName(asset.name);
      }

      assets.push(asset);
    }
  });

  return assets;
}

/**
 * Allows a Webpack plugin to modify the contents of processed JavaScript files.
 */
export function addAssetSourceTap(
  pluginName: string,
  compiler: Compiler,
  assetSourceCallback: AssetSourceCallback
): void {

  compiler.hooks.emit.tap(pluginName, compilation => {

    const assets: AssetEntry[] = Object.entries(compilation.assets);
    for (const [file, asset] of assets) {
      if (path.parse(file).ext === '.js') {
        const content = asset.source();
        asset.source = () => assetSourceCallback(content, file);
      }
    }

    return true;
  });
}
