import {
  loader
} from 'webpack';

import {
  replaceAndEmitAssets
} from './asset-utis';

const TEMPLATE_REGEX = /template\s*:\s*(["'`])([\s\S]*?)\1/gm;

export default function AssetsLoaderTS(
  this: loader.LoaderContext,
  content: string
) {

  const match = TEMPLATE_REGEX.exec(content);

  if (content.indexOf('@Component(') > -1 && match) {
    const template = replaceAndEmitAssets.apply(this, [match[2], true]);

    // Altering content here currently has no affect
    // We still process it here; however, in order to support inline templates.
    content = content.replace(match[0], `template: \`${template}\``);
  }

  return content;
}