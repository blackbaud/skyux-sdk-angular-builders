import {
  loader
} from 'webpack';

import {
  replaceAndEmitAssets
} from './asset-utis';

export default function AssetsLoaderHTML(
  this: loader.LoaderContext,
  content: string
) {
  return replaceAndEmitAssets.apply(this, [content, false]);
}
