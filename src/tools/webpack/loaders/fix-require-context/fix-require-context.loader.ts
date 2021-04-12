import { loader } from 'webpack';

/**
 * Replaces the ng-packagr transpiled `commonjsRequire.context` with the normal `require.context`
 * so that dynamic require statements work as they should. (The ng-packagr package uses rollup
 * behind the scenes, which deliberately removes `require.context` for AoT builds, but we require
 * dynamic requires for testing resource strings in unit tests.)
 * @see: https://github.com/rollup/plugins/blob/master/packages/commonjs/src/helpers.js#L40-L42
 * @see: https://github.com/blackbaud/skyux-i18n/blob/master/src/app/public/testing/resources-test.service.ts#L42
 */
export default function fixRequireContextLoader(
  this: loader.LoaderContext,
  source: Buffer
) {
  return source
    .toString()
    .replace(/commonjsRequire\.context/g, 'require.context');
}
