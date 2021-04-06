import { BuilderContext } from '@angular-devkit/architect';

import fs from 'fs-extra';

import path from 'path';

import { getCertPath } from '../../shared/cert-utils';
import { openHostUrl } from '../../shared/host-utils';
import { createServer } from '../../shared/server';

import { SkyuxBrowserBuilderOptions } from './browser-options';
import { SkyuxConfig } from '../../shared/skyux-config';
import { SkyuxHostAssetType } from '../../shared/host-asset-type';
import { SkyuxHostAsset } from '../../shared/host-asset';

export async function serveBuildResults(
  _options: SkyuxBrowserBuilderOptions,
  context: BuilderContext,
  skyuxConfig: SkyuxConfig
): Promise<void> {
  /*istanbul ignore next line*/
  const projectName = context.target?.project!;
  const rootDir = path.resolve(process.cwd(), `dist/${projectName}`);
  const port = 4200;

  await createServer({
    baseHref: projectName,
    port,
    rootDir,
    sslCert: getCertPath('skyux-server.crt'),
    sslKey: getCertPath('skyux-server.key')
  });

  const metadata = fs.readJsonSync(path.resolve(rootDir, 'metadata.json'));

  console.log('metadata:', metadata);

  openHostUrl({
    assets: {
      scripts: metadata.filter(
        (x: SkyuxHostAsset) => x.type === SkyuxHostAssetType.Script
      ),
      stylesheets: metadata.filter(
        (x: SkyuxHostAsset) => x.type === SkyuxHostAssetType.Stylesheet
      )
    },
    baseHref: projectName,
    externals: skyuxConfig.app?.externals,
    host: skyuxConfig.host,
    localUrl: `https://localhost:${port}`
  });

  return new Promise((resolve) => {
    process.on('SIGINT', () => {
      resolve();
    });
  });
}
