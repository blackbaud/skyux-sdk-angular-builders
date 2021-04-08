import { Stats } from 'webpack';

import { dasherize, underscore } from '../../shared/string-utils';

import { SkyuxHostAsset } from './host-asset';
import { SkyuxHostAssetType } from './host-asset-type';

const FALLBACK_CSS_PROPERTY = 'visibility';
const FALLBACK_CSS_VALUE = 'hidden';

function getFallbackCssClassName(fileName: string): string {
  return `sky-pages-ready-${dasherize(fileName)}`;
}

export function getFallbackTestCssRule(name: string): string {
  return `.${getFallbackCssClassName(
    name
  )} {${FALLBACK_CSS_PROPERTY}:${FALLBACK_CSS_VALUE};}`;
}

export function getFallbackTestVariable(name: string): string {
  return `SKY_PAGES_READY_${underscore(name).toUpperCase()}`;
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
  let scripts: SkyuxHostAsset[] = [];
  let stylesheets: SkyuxHostAsset[] = [];

  const isJavaScript = (filepath: string) => /\.js$/.test(filepath);
  const isCss = (filepath: string) => /\.css$/.test(filepath);

  const chunks = stats?.chunks;
  if (chunks) {
    chunks.forEach((chunk) => {
      const name = chunk.files[0];
      console.log(name);
    });

    // Get style sheets.
    stylesheets = chunks
      .filter((chunk) => isCss(chunk.files[0]))
      .map((chunk) => {
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

        return stylesheet;
      });

    // Get scripts.
    scripts = chunks
      .filter((chunk) => {
        // Only include primary and lazy-loaded scripts.
        return (
          isJavaScript(chunk.files[0]) &&
          (chunk.initial || config?.includeLazyloadedChunks)
        );
      })
      .map((chunk) => {
        const name = chunk.files[0];
        const script: SkyuxHostAsset = {
          name,
          type: name.includes('-es2015')
            ? SkyuxHostAssetType.Module
            : SkyuxHostAssetType.Script
        };

        if (config?.includeFallback) {
          script.fallback = getFallbackTestVariable(script.name);
        }

        if (config?.includeLazyloadedChunks) {
          script.initial = !!chunk.initial;
        }

        return script;

        // // Polyfills (and in consequence, `zone.js`) need to be loaded first during AoT builds.
        // if (script.name.indexOf('polyfill') > -1) {
        //   scripts.unshift(script);
        // } else {
        //   scripts.push(script);
        // }
      });
  }

  const sortedScripts: SkyuxHostAsset[] = [];
  const remaining: SkyuxHostAsset[] = [];

  const order = ['runtime', 'polyfills', 'main'];
  order.forEach((key) => {
    scripts.forEach((script) => {
      if (script.name.startsWith(key)) {
        sortedScripts.push(script);
      } else {
        remaining.push(script);
      }
    });
  });

  console.log('Sorted scripts:', sortedScripts);
  console.log('Remaining:', remaining);

  return {
    scripts: sortedScripts.concat(remaining),
    stylesheets
  };
}
