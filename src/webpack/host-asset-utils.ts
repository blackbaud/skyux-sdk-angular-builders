import {
  Stats
} from 'webpack';

import {
  SkyuxHostAsset
} from './host-asset';

export function getFallbackName(name: string): string {
  return `SKY_PAGES_READY_${name.toUpperCase().replace(/(\.|-|~)/g, '_')}`;
}

export function getHostAssets(
  stats: Stats.ToJsonOutput,
  config?: {
    includeFallback?: boolean;
    includeLazyloadedChunks?: boolean;
  }
): SkyuxHostAsset[] {
  const assets: SkyuxHostAsset[] = [];

  stats?.chunks?.forEach(chunk => {
    if (chunk.initial || config?.includeLazyloadedChunks) {
      const asset: SkyuxHostAsset = {
        name: chunk.files[0]
      };

      if (config?.includeFallback) {
        asset.fallback = getFallbackName(asset.name);
      }

      if (config?.includeLazyloadedChunks) {
        asset.initial = !!chunk.initial;
      }

      // Polyfills (and in consequence, `zone.js`) need to be loaded first during AoT builds.
      if (asset.name.indexOf('polyfill') > -1) {
        assets.unshift(asset);
      } else {
        assets.push(asset);
      }
    }
  });

  return assets;
}
