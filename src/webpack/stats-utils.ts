import {
  Stats
} from 'webpack';

interface Asset {
  name: string;
}

export function getAssets(stats: Stats.ToJsonOutput): Asset[] {
  if (!stats) {
    return [];
  }

  const assets: Asset[] = [];
  stats.chunks?.forEach(chunk => {
    if (chunk.initial) {
      const asset: Asset = {
        name: chunk.files[0]
      };

      assets.push(asset);
    }
  });

  return assets;
}
