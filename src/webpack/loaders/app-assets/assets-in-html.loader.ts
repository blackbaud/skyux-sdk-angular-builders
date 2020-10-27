import {
  getOptions
} from 'loader-utils';

import validateOptions from 'schema-utils';

import {
  loader
} from 'webpack';

import {
  saveAndEmitAssets
} from './save-and-emit-assets';

const schema = require('./schema.json');

/**
 * This loader registers all asset paths that are found in Angular components'
 * HTML templates (e.g., `@Component({ templateUrl: './foo.component.html' })`).
 * The relative paths are replaced with absolute URLs in the `SkyuxAssetUrlsPlugin`.
 */
export default function assetsInHtmlLoader(
  this: loader.LoaderContext,
  content: string
) {

  const options = getOptions(this);
  validateOptions(schema, options, {
    name: 'SKY UX Assets in HTML Loader'
  });

  saveAndEmitAssets.call(this, content, {
    assetBaseUrl: options.assetBaseUrl as string
  });

  return content;
}
