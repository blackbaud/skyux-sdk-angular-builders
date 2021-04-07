import { BuilderContext } from '@angular-devkit/architect';

import fs from 'fs-extra';
import path from 'path';

import { getCertPath } from '../../shared/cert-utils';
import { SkyuxHostAsset } from '../../shared/host-asset';
import { SkyuxHostAssetType } from '../../shared/host-asset-type';
import { createHostUrl, openHostUrl } from '../../shared/host-utils';
import { createServer } from '../../shared/server';
import { SkyuxConfig } from '../../shared/skyux-config';
import { ensureTrailingSlash } from '../../shared/url-utils';

import { SkyuxBrowserBuilderOptions } from './browser-options';

export function applySkyuxBrowserOptions(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext,
  port?: number
): void {
  const projectName = context.target!.project!;
  const baseHref = `${projectName}/`;

  options.deployUrl = options.deployUrl || '';
  if (options.skyuxServe && !options.deployUrl) {
    options.deployUrl = `https://localhost:${port}/`;
  }

  options.deployUrl = ensureTrailingSlash(options.deployUrl);
  if (!options.deployUrl?.endsWith(baseHref)) {
    options.deployUrl += baseHref;
  }
}

export async function serveBuildResults(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext,
  skyuxConfig: SkyuxConfig,
  port: number
): Promise<void> {
  const baseHref = context.target?.project!;
  const rootDir = path.join(process.cwd(), options.outputPath);

  await createServer({
    baseHref,
    port,
    rootDir,
    sslCert: getCertPath('skyux-server.crt'),
    sslKey: getCertPath('skyux-server.key')
  });

  const metadata = fs.readJsonSync(path.join(rootDir, 'metadata.json'));

  const url = createHostUrl(skyuxConfig.host.url, baseHref, {
    externals: skyuxConfig.app?.externals,
    host: skyuxConfig.host,
    localUrl: `https://localhost:${port}/${baseHref}/`,
    rootElementTagName: 'app-root',
    scripts: metadata.filter(
      (x: SkyuxHostAsset) => x.type === SkyuxHostAssetType.Script
    ),
    stylesheets: metadata.filter(
      (x: SkyuxHostAsset) => x.type === SkyuxHostAssetType.Stylesheet
    )
  });

  openHostUrl(url);

  return new Promise((resolve) => {
    process.on('SIGINT', () => {
      resolve();
    });
  });
}
