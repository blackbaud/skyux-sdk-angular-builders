import { Stats } from 'webpack';

import {
  dasherize,
  underscore
} from '../../shared/string-utils';

import { SkyuxHostAsset } from './host-asset';

import { SkyuxHostAssetType } from './host-asset-type';

const FALLBACK_CSS_PROPERTY = 'visibility';
const FALLBACK_CSS_VALUE = 'hidden';

function getFallbackCssClassName(fileName: string): string {
  return `sky-pages-ready-${dasherize(fileName)}`;
}

export function getFallbackTestCssRule(
  name: string
): string {
  return `.${getFallbackCssClassName(
    name
  )} {${FALLBACK_CSS_PROPERTY}:${FALLBACK_CSS_VALUE};}`;
}

export function getFallbackTestVariable(
  name: string
): string {
  return `SKY_PAGES_READY_${underscore(
    name
  ).toUpperCase()}`;
}

/**
 * Returns scripts and style sheet assets from Webpack chunks.
 */
export function getHostAssets(
  stats: Stats.ToJsonOutput,
  config?: {
    includeFallback?: boolean;
    includeLazyloadedChunks?: boolean;
  }
): {
  scripts: SkyuxHostAsset[];
  stylesheets: SkyuxHostAsset[];
} {
  const scripts: SkyuxHostAsset[] = [];
  const stylesheets: SkyuxHostAsset[] = [];

  const isJavaScript = (filepath: string) =>
    /\.js$/.test(filepath);
  const isCss = (filepath: string) =>
    /\.css$/.test(filepath);

  const chunks = stats?.chunks;
  if (chunks) {
    // Get style sheets.
    chunks
      .filter((chunk) => isCss(chunk.files[0]))
      .forEach((chunk) => {
        const fileName = chunk.files[0];
        const stylesheet: SkyuxHostAsset = {
          name: fileName,
          type: SkyuxHostAssetType.Stylesheet
        };

        if (config?.includeFallback) {
          stylesheet.fallbackStylesheet = {
            class: getFallbackCssClassName(fileName),
            property: FALLBACK_CSS_PROPERTY,
            value: FALLBACK_CSS_VALUE
          };
        }

        stylesheets.push(stylesheet);
      });

    // Get scripts.
    chunks
      .filter((chunk) => {
        // Only include primary and lazy-loaded scripts.
        return (
          isJavaScript(chunk.files[0]) &&
          (chunk.initial || config?.includeLazyloadedChunks)
        );
      })
      .forEach((chunk) => {
        const script: SkyuxHostAsset = {
          name: chunk.files[0],
          type: SkyuxHostAssetType.Script
        };

        if (config?.includeFallback) {
          script.fallback = getFallbackTestVariable(
            script.name
          );
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

  return {
    scripts,
    stylesheets
  };
}
