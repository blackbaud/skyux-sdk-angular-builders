import path from 'path';

import webpack from 'webpack';

import { ConcatSource } from 'webpack-sources';

type AssetSourceCallback = (
  content: string,
  filePath: string
) => string;

function modifyChunkContents(
  fileExtension: '.css' | '.js',
  compilation: webpack.compilation.Compilation,
  callback: AssetSourceCallback
): void {
  const filePaths = Object.keys(compilation.assets);

  for (const filePath of filePaths) {
    if (path.parse(filePath).ext === fileExtension) {
      compilation.updateAsset(filePath, (old) => {
        return new ConcatSource(
          callback(old.source(), filePath)
        );
      });
    }
  }
}

/**
 * Allows a Webpack plugin to modify the contents of all emitted JavaScript assets.
 */
export function modifyScriptContents(
  compilation: webpack.compilation.Compilation,
  callback: AssetSourceCallback
): void {
  modifyChunkContents('.js', compilation, callback);
}

/**
 * Allows a Webpack plugin to modify the contents of all emitted CSS assets.
 */
export function modifyStylesheetContents(
  compilation: webpack.compilation.Compilation,
  callback: AssetSourceCallback
): void {
  modifyChunkContents('.css', compilation, callback);
}
