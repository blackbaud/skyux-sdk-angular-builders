import path from 'path';

import {
  Compiler
} from 'webpack';

type AssetSourceCallback = (content: string, filePath: string) => void;

/**
 * Allows a Webpack plugin to modify the contents of all emitted JavaScript assets.
 */
export function addWebpackAssetsEmitTap(
  pluginName: string,
  compiler: Compiler,
  callback: AssetSourceCallback
): void {

  compiler.hooks.emit.tap(pluginName, (compilation) => {
    const assets: [string, any][] = Object.entries(compilation.assets);

    for (const [filePath, asset] of assets) {
      if (path.parse(filePath).ext === '.js') {
        const content = asset.source();
        asset.source = () => callback(content, filePath);
      }
    }

    return true;
  });
}
