import open from 'open';

import {
  Stats
} from 'webpack';

import {
  SkyuxHostAsset
} from './host-asset';

import { SkyuxHostConfig } from './plugins/open-host-url/host-config';

export function getFallbackName(name: string): string {
  return `SKY_PAGES_READY_${name.toUpperCase().replace(/(\.|-)/g, '_')}`;
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

      assets.push(asset);
    }
  });

  return assets;
}

export function openHostUrl(
  hostUrl: string,
  pathName: string,
  config: SkyuxHostConfig
): void {
  // We need to URL encode the value so that characters such as '+'
  // are properly represented.
  const configEncoded = encodeURIComponent(
    Buffer.from(JSON.stringify(config)).toString('base64')
  );

  const url = `${hostUrl}${pathName}/?local=true&_cfg=${configEncoded}`;

  console.log(`SKY UX Host URL:\n\n${url}`);

  open(url);
}
