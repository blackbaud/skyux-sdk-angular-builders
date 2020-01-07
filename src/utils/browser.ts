import {
  SkyBuilderOptions
} from '../builder-options';

import {
  SkyHost,
  SkyHostGetUrlArgs
} from './host';

const sorter = require('html-webpack-plugin/lib/chunksorter');

function parseWebpackScripts(chunks: any): any[] {
  const scripts: any[] = [];

  // Used when skipping the build, short-circuit to return metadata
  if (chunks.metadata) {
    return chunks.metadata;
  }

  sorter.dependency(chunks, undefined, {}).forEach((chunk: any) => {
    scripts.push({
      name: chunk.files[0]
    });
  });

  // Webpack reversed the order of these scripts
  scripts.reverse();

  return scripts;
}

export class SkyBrowser {

  public static getLaunchUrl(options: SkyBuilderOptions, stats: any): string {

    const spaName = options.baseHref as string;
    const localUrl = `https://localhost:${options.port}/`;

    const args: SkyHostGetUrlArgs = {
      localAssets: {
        scripts: parseWebpackScripts(stats.toJson().chunks)
      },
      localUrl,
      spaName
    };

    if (options.skyux.host.url) {
      args.baseUrl = options.skyux.host.url;
    }

    if (options.skyux.app && options.skyux.app.externals) {
      args.externalAssets = options.skyux.app.externals;
    }

    return SkyHost.getUrl(args);
  }

}
