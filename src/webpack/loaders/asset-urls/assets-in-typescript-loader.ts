import {
  getOptions
} from 'loader-utils';

import validateOptions from 'schema-utils';

import {
  loader
} from 'webpack';

import {
  SkyuxApplicationAssetHelper
} from '../../app-asset-helper';

import {
  ensureTrailingSlash
} from '../../../shared/url-utils';

const schema = require('./asset-urls-loader-schema.json');

const ASSETS_REGEX = /assets\/.*?\.[\.\w]+/gi;
const COMPONENT_REGEX = /@Component/;
const TEMPLATE_REGEX = /template\s*:(\s*['"`]([\s\S]*?)['"`]\s*([,}]))/gm;

/**
 * This loader registers all asset paths that are found in Angular components' _inline_
 * HTML templates (e.g., `@Component({ template: 'Some content here.' })`).
 * The relative paths are replaced with absolute URLs in the `SkyuxAssetUrlsPlugin`.
 */
export default function assetsInTypeScriptLoader(
  this: loader.LoaderContext,
  content: string
) {
  if (
    COMPONENT_REGEX.test(content) &&
    TEMPLATE_REGEX.test(content)
  ) {

    const options = getOptions(this);
    validateOptions(schema, options, {
      name: 'SKY UX HTML Assets Loader'
    });

    // Prevent the same file from being processed more than once.
    const processedFiles: string[] = [];

    content.match(ASSETS_REGEX)?.forEach(filePath => {
      if (!processedFiles.includes(filePath)) {
        processedFiles.push(filePath);

        const baseUrl = ensureTrailingSlash(options.assetBaseUrl as string);
        const url = `${baseUrl}${filePath.replace(/\\/g, '/')}`;

        SkyuxApplicationAssetHelper.queue({
          filePath,
          url
        });

        return content;
      }
    });
  }

  return content;
}
