import {
  Stats
} from 'webpack';

import {
  SkyuxConfig
} from '../../shared/skyux-config';

import {
  SkyuxHostAsset
} from './host-asset';

import {
  SkyuxHostAssetType
} from './host-asset-type';

export function getFallbackName(name: string): string {
  return `SKY_PAGES_READY_${name.toUpperCase().replace(/(\.|-|~)/g, '_')}`;
}

/**
 * Returns scripts and style sheet assets from Webpack chunks.
 */
export function getHostAssets(
  stats: Stats.ToJsonOutput,
  skyuxConfig: SkyuxConfig,
  config?: {
    includeFallback?: boolean;
    includeLazyloadedChunks?: boolean;
  }
): {
  scripts: SkyuxHostAsset[];
  styleSheets: SkyuxHostAsset[];
} {
  const scripts: SkyuxHostAsset[] = [];
  const styleSheets: SkyuxHostAsset[] = [];

  const isJavaScript = (filepath: string) => /\.js$/.test(filepath);
  const isCss = (filepath: string) => /\.css$/.test(filepath);

  const chunks = stats?.chunks;
  if (chunks) {

    // Get style sheets.
    chunks
      .filter(chunk => isCss(chunk.files[0]))
      .forEach(chunk => {
        styleSheets.push({
          type: SkyuxHostAssetType.StyleSheet,
          name: chunk.files[0]
        });
      });

    // Get scripts.
    chunks
      .filter(chunk => {
        // Only include primary and lazy-loaded scripts.
        return isJavaScript(chunk.files[0]) &&
          (chunk.initial || config?.includeLazyloadedChunks);
      })
      .forEach(chunk => {
        const script: SkyuxHostAsset = {
          name: chunk.files[0],
          type: SkyuxHostAssetType.Script
        };

        if (config?.includeFallback) {
          script.fallback = getFallbackName(script.name);
        }

        if (config?.includeLazyloadedChunks) {
          script.initial = !!chunk.initial;
        }

        // Polyfills (and in consequence, `zone.js`) need to be loaded first during AoT builds.
        if (script.name.indexOf('polyfill') > -1) {
          scripts.unshift(script);
        } else {
          scripts.push(script);
        }
      });
  }

  // Add any style sheets from skyuxConfig.
  const skyuxStyles = skyuxConfig.app?.styles;
  if (skyuxStyles) {
    styleSheets.concat(skyuxStyles.map(x => {
      return {
        name: x,
        type: SkyuxHostAssetType.StyleSheet
      };
    }))
  }

  return {
    scripts,
    styleSheets
  };
}
