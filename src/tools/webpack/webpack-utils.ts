import path from 'path';

import webpack from 'webpack';

type AssetSourceCallback = (content: string, filePath: string) => string;

interface CompilationAsset {
  source: () => string;
};

function modifyChunkContents(
  fileExtension: 'css' | 'js',
  compilation: webpack.compilation.Compilation,
  callback: AssetSourceCallback
): void {
  const assets: [string, CompilationAsset][] = Object.entries(compilation.assets);
  for (const [filePath, asset] of assets) {
    if (path.parse(filePath).ext === `.${fileExtension}`) {
      const content = asset.source();
      asset.source = () => callback(content, filePath);
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
  modifyChunkContents('js', compilation, callback);
}

/**
 * Allows a Webpack plugin to modify the contents of all emitted CSS assets.
 */
 export function modifyStylesheetContents(
  compilation: webpack.compilation.Compilation,
  callback: AssetSourceCallback
): void {
  modifyChunkContents('css', compilation, callback);
}
