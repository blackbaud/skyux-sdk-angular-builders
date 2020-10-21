import {
  BuilderContext
} from '@angular-devkit/architect';

import fs from 'fs-extra';

import path from 'path';

import {
  getHostUrlFromOptions,
  openHostUrl
} from '../../shared/host-utils';

import {
  createServer
} from '../../shared/server';

import {
  SkyuxBrowserBuilderOptions
} from './browser-options';

export async function serveBuildResults(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Promise<void> {
  /*istanbul ignore next line*/
  const projectName = context.target?.project!;
  const rootDir = path.resolve(process.cwd(), `dist/${projectName}`);

  const port = await createServer({ rootDir });
  const metadata = fs.readJsonSync(path.resolve(rootDir, 'metadata.json'));

  openHostUrl(
    getHostUrlFromOptions(options),
    projectName,
    {
      localUrl: `https://localhost:${port}`,
      scripts: metadata
    }
  );

  return new Promise(resolve => {
    process.on('SIGINT', () => {
      resolve();
    });
  });
}
