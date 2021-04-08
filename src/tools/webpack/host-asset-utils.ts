import { Stats } from 'webpack';

import { dasherize, underscore } from '../../shared/string-utils';

import { SkyuxHostAsset } from './host-asset';
import { SkyuxHostAssetType } from './host-asset-type';

const FALLBACK_CSS_PROPERTY = 'visibility';
const FALLBACK_CSS_VALUE = 'hidden';

/**
 * Ensures script assets are ordered according to what Angular recommends.
 * @see: https://angular.io/guide/deployment#differential-builds
 */
function sortScripts(scripts: SkyuxHostAsset[]): SkyuxHostAsset[] {
  const sortedScripts: SkyuxHostAsset[] = [];
  const remaining = [...scripts];

  const order = [
    'runtime-es2015.',
    'runtime-es5.',
    'runtime.',
    'polyfills-es2015.',
    'polyfills-es5.',
    'polyfills.',
    'vendor-es2015.',
    'vendor-es5.',
    'vendor.',
    'main-es2015.',
    'main-es5.',
    'main.'
  ];

  for (const key of order) {
    scripts.forEach((script, i) => {
      if (script.name.startsWith(key)) {
        sortedScripts.push(script);
        delete remaining[i];
      }
    });
  }

  // Add any remaining scripts and return the result.
  return sortedScripts.concat(remaining.filter((x) => x));
}

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
  const scripts: SkyuxHostAsset[] = [];
  const stylesheets: SkyuxHostAsset[] = [];

  const isJavaScript = (filepath: string) => /\.js$/.test(filepath);
  const isCss = (filepath: string) => /\.css$/.test(filepath);

  const chunks = stats?.chunks;
  if (chunks) {
    chunks.forEach((chunk) => {
      const fileName = chunk.files[0];

      // Only include primary and lazy-loaded scripts.
      if (
        isJavaScript(fileName) &&
        (chunk.initial || config?.includeLazyloadedChunks)
      ) {
        const script: SkyuxHostAsset = {
          name: fileName,
          type: SkyuxHostAssetType.Script
        };

        if (config?.includeFallback) {
          script.fallback = getFallbackTestVariable(script.name);
        }

        if (config?.includeLazyloadedChunks) {
          script.initial = !!chunk.initial;
        }

        scripts.push(script);
        return;
      }

      // Get style sheets.
      if (isCss(fileName)) {
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
      }
    });
  }

  return {
    scripts: sortScripts(scripts),
    stylesheets
  };
}
