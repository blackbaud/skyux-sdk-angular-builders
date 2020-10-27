import {
  getOptions
} from 'loader-utils';

import validateOptions from 'schema-utils';

import {
  loader
} from 'webpack';

import {
  saveAndEmitAssets
} from './app-assets-utils';

const schema = require('./schema.json');

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
      name: 'SKY UX Assets in TypeScript Loader'
    });

    saveAndEmitAssets.apply(this, [content, {
      assetBaseUrl: options.assetBaseUrl as string
    }]);
  }

  return content;
}
