import {
  parse,
  resolve
} from 'path';

import {
  loader
} from 'webpack';

import {
  sync
} from 'hash-file';

import {
  AssetState
} from '../../shared/asset-state';

import {
  Logger
} from '../../shared/logger';

const ASSETS_REGEX = /assets\/.*?\.[\.\w]+/gi;

export function replaceAndEmitAssets(
  this: loader.LoaderContext,
  content: string,
  queueAssetReplace: boolean
) {
  const baseUrl = AssetState.getBaseUrl();

  // In case the same file is referenced more than once
  const hashedMap: { [key: string]: boolean } = {};

  content.match(ASSETS_REGEX)?.forEach(filePath => {

    if (hashedMap[filePath]) {
      return;
    }

    const filePathResolved = resolve(process.cwd(), 'src/', filePath);
    const parsed = parse(filePath);
    const hash = sync(filePathResolved);
    const fileNameWithHash = `${parsed.name}.${hash}${parsed.ext}`;
    const filePathWithHash = `${parsed.dir}/${fileNameWithHash}`;

    // Write hashed file to disk
    Logger.info(`Emitting ${fileNameWithHash}.`);
    this.emitFile(
      filePathWithHash,
      this.fs.readFileSync(filePathResolved),
      undefined
    );

    // Make sure trailing slash exists since we no longer have a leading slash on assets
    const seperator = baseUrl[baseUrl.length - 1] === '/' ? '' : '/';

    // filePath can be '\' in Windows
    const url = `${baseUrl}${seperator}${filePathWithHash.replace(/\\/gi, '/')}`;

    if (queueAssetReplace) {
      AssetState.queue({
        filePath,
        url
      });
    } else {
      content = content.replace(
        new RegExp(filePath, 'gi'),
        url
      );
    }

    hashedMap[filePath] = true;
  });

  return content;
}