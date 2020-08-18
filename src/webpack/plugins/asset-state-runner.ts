import {
  parse
} from 'path';

import {
  Compiler
} from 'webpack';

import {
  AssetState
} from '../../shared/asset-state';

const PLUGIN_NAME = 'asset-state-runner-plugin';

// This plugin is a compromise from not having access to manipulate TS files in the webpack loader chain
// versus having to copy the src directory, manipulate the files on disk, and point the build to it instead.
// If the Angular team does decide to expose that functionality first-class, this plugin would be obsolete.
export function AssetStateRunnerPlugin(compiler: Compiler): void {
  compiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {
    Object.keys(compilation.assets)
      .filter(file => parse(file).ext === '.js')
      .forEach(key => {
        const asset = compilation.assets[key];
        const content = asset.source();
        asset.source = () => AssetState.run(content);
      });

    return true;
  });
}