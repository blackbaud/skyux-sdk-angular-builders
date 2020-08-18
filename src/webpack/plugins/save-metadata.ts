import {
  writeFileSync
} from 'fs';

import {
  join,
  parse
} from 'path';

import {
  Compiler
} from 'webpack';

import {
  Logger
} from '../../shared/logger';

const PLUGIN_NAME = 'save-metadata-plugin';

function getFallbackName(name: string) {
  return `SKY_PAGES_READY_${name.toUpperCase().replace(/\./g, '_')}`;
}

interface assetChunks {
  name: string;
  fallback: string;
}

export function SaveMetadataPlugin(compiler: Compiler): void {
  compiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {
    Object.keys(compilation.assets)
      .filter(file => parse(file).ext === '.js')
      .forEach(key => {
        const asset = compilation.assets[key];
        const content = asset.source();
        asset.source = () => `${content}
var ${getFallbackName(key)} = true;`;
      });

    return true;
  });

  compiler.hooks.done.tap(PLUGIN_NAME, stats => {
    const files = stats.toJson().assetsByChunkName;
    const metadata: assetChunks[] = [];

    Object.keys(files).forEach(key => {
      metadata.push({
        name: files[key][0],
        fallback: getFallbackName(files[key][0])
      });
    });

    writeFileSync(
      join(process.cwd(), 'dist', 'metadata.json'),
      JSON.stringify(metadata, null, '\t')
    );
    
    Logger.flush();
  });
}