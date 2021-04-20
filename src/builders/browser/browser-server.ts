import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { executeBrowserBuilder } from '@angular-devkit/build-angular';

import fs from 'fs-extra';
import open from 'open';
import path from 'path';

import { getCertPath } from '../../shared/cert-utils';
import { getBaseHref } from '../../shared/context-utils';
import { createHostUrl } from '../../shared/create-host-url';
import { SkyuxHostAsset } from '../../shared/host-asset';
import { SkyuxHostAssetType } from '../../shared/host-asset-type';
import { SkyuxConfig } from '../../shared/skyux-config';

import { SkyuxBrowserBuilderOptions } from './browser-options';
import { getBrowserTransforms } from './browser-transforms';
import { applySkyuxBrowserOptions } from './browser-utils';
import { SkyuxServer } from './server';

function getAssetsFromMetadata(
  distPath: string
): {
  scripts: SkyuxHostAsset[];
  stylesheets: SkyuxHostAsset[];
} {
  const metadata = fs.readJsonSync(path.join(distPath, 'metadata.json'));
  return {
    scripts: metadata.filter(
      (x: SkyuxHostAsset) => x.type === SkyuxHostAssetType.Script
    ),
    stylesheets: metadata.filter(
      (x: SkyuxHostAsset) => x.type === SkyuxHostAssetType.Stylesheet
    )
  };
}

export async function serveBuildResults(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext,
  skyuxConfig: SkyuxConfig
): Promise<BuilderOutput> {
  const distPath = path.join(process.cwd(), options.outputPath);

  // Start the local server.
  const server = new SkyuxServer({
    distPath,
    rootPath: getBaseHref(context),
    sslCert: getCertPath('skyux-server.crt'),
    sslKey: getCertPath('skyux-server.key')
  });

  const port = await server.start();

  options.deployUrl = options.deployUrl || `https://localhost:${port}/`;
  applySkyuxBrowserOptions(options, context);

  // Run the build.
  const result = await executeBrowserBuilder(
    options,
    context,
    getBrowserTransforms(options, context)
  ).toPromise();

  // Open the Host URL.
  const assets = getAssetsFromMetadata(distPath);
  const url = createHostUrl(skyuxConfig.host!.url!, getBaseHref(context), {
    host: skyuxConfig.host!,
    externals: skyuxConfig.app?.externals,
    localUrl: options.deployUrl,
    scripts: assets.scripts,
    stylesheets: assets.stylesheets
  });
  open(url);

  // Prevent the child process from exiting after Angular completes the build.
  return new Promise((resolve) => {
    server.onExit(() => {
      resolve(result);
    });
  });
}
