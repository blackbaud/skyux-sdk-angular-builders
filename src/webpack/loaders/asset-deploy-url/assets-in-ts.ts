import path from 'path';

import {
  loader
} from 'webpack';

import {
  AssetState
} from '../../../shared/asset-state';

const ASSETS_REGEX = /assets\/.*?\.[\.\w]+/gi;
const TEMPLATE_REGEX = /template\s*:(\s*['"`]([\s\S]*?)['"`]\s*([,}]))/gm;

export default function AssetsLoaderTS(
  this: loader.LoaderContext,
  content: string
) {
  if (content.indexOf('@Component(') === -1) {
    return content;
  }

  const match = TEMPLATE_REGEX.exec(content);
  if (match) {

    console.log('\nFound component file:', this.resourcePath);

    // Prevent the same file from being processed more than once.
    const processedFiles: string[] = [];

    content.match(ASSETS_REGEX)?.forEach(filePath => {
      console.log('\nFound an asset!', filePath);
      if (processedFiles.includes(filePath)) {
        return;
      }

      processedFiles.push(filePath);

      AssetState.queue({
        filePath,
        url: path.join('https://app.blackbaud.com/', filePath)
      });
    });
  }

  return content;
}
