import { BuilderContext } from '@angular-devkit/architect';

import fs from 'fs-extra';
import path from 'path';

import { getCertPath } from '../../shared/cert-utils';
import { getBaseHref } from '../../shared/context-utils';
import { SkyuxHostAsset } from '../../shared/host-asset';
import { SkyuxHostAssetType } from '../../shared/host-asset-type';
import { createHostUrl, openHostUrl } from '../../shared/host-utils';
import { SkyuxConfig } from '../../shared/skyux-config';
import { ensureBaseHref, ensureTrailingSlash } from '../../shared/url-utils';

import { SkyuxBrowserBuilderOptions } from './browser-options';
import { createServer } from './server';

export function applySkyuxBrowserOptions(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): void {
  const baseHref = getBaseHref(context);

  let deployUrl = options.deployUrl || '';
  deployUrl = ensureTrailingSlash(deployUrl);
  deployUrl = ensureBaseHref(deployUrl, baseHref);
  options.deployUrl = deployUrl;
}

export async function serveBuildResults(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext,
  skyuxConfig: SkyuxConfig,
  port: number
): Promise<void> {
  const baseHref = getBaseHref(context);
  const distPath = path.join(process.cwd(), options.outputPath);

  const server = createServer({
    distPath,
    port,
    rootPath: baseHref,
    sslCert: getCertPath('skyux-server.crt'),
    sslKey: getCertPath('skyux-server.key')
  });

  const metadata = fs.readJsonSync(path.join(distPath, 'metadata.json'));

  const url = createHostUrl(skyuxConfig.host.url, baseHref, {
    externals: skyuxConfig.app?.externals,
    host: skyuxConfig.host,
    localUrl: ensureBaseHref(`https://localhost:${port}/`, baseHref),
    rootElementTagName: 'app-root',
    scripts: metadata.filter(
      (x: SkyuxHostAsset) => x.type === SkyuxHostAssetType.Script
    ),
    stylesheets: metadata.filter(
      (x: SkyuxHostAsset) => x.type === SkyuxHostAssetType.Stylesheet
    )
  });

  await server.start();

  openHostUrl(url);

  return new Promise((resolve) => {
    process.on('exit', () => {
      server.stop();
      resolve();
    });

    process.on('SIGINT', () => {
      server.stop();
      resolve();
    });
  });
}
