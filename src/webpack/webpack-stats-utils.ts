import path from 'path';

import {
  Compiler
} from 'webpack';

type AssetSourceCallback = (content: string, file: string) => void;

/**
 * Allows a Webpack plugin to modify the contents of processed JavaScript files.
 */
export function addAssetSourceTap(
  pluginName: string,
  compiler: Compiler,
  assetSourceCallback: AssetSourceCallback
): void {

  compiler.hooks.emit.tap(pluginName, (compilation) => {
    const assets: [string, any][] = Object.entries(compilation.assets);
    for (const [file, asset] of assets) {
      if (path.parse(file).ext === '.js') {
        const content = asset.source();
        asset.source = () => assetSourceCallback(content, file);
      }
    }

    return true;
  });
}
