// import hashFile from 'hash-file';

import {
  getOptions
} from 'loader-utils';

// import path from 'path';

import validateOptions from 'schema-utils';

import {
  loader
} from 'webpack';

const schema = require('./assets-in-html-schema.json');

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

    const options = getOptions(this);
    validateOptions(schema, options, {
      name: 'SKY UX HTML Assets Loader'
    });

    console.log('\nFound component file:', this.resourcePath);

    // Prevent the same file from being processed more than once.
    const processedFiles: string[] = [];

    content.match(ASSETS_REGEX)?.forEach(filePath => {
      console.log('\nFound an asset!', filePath);
      if (processedFiles.includes(filePath)) {
        return;
      }

      processedFiles.push(filePath);

      // const filePathResolved = path.resolve(process.cwd(), 'src/', filePath);
      // const hash = hashFile.sync(filePathResolved);

      const url = `${options.baseUrl}${filePath.replace(/\\/g, '/')}`;

      AssetState.queue({
        filePath,
        url
      });

      // const template = match[2].replace(
      //   new RegExp(filePath, 'gi'),
      //   url
      // );

      // content = content.replace(match[0], `template: \`${template}\``);
      return content;
    });
  }

  return content;
}
