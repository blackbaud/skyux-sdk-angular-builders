import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';

import {
  executeBrowserBuilder
} from '@angular-devkit/build-angular';

import {
  JsonObject
} from '@angular-devkit/core';

import cors from 'cors';
import express from 'express';
import fs from 'fs-extra';
import https from 'https';
import path from 'path';
import { openHostUrl } from '../../webpack/host-utils';

// import {
//   Observable,
//   of
// } from 'rxjs';

import {
  getCertPath
} from '../dev-server/utils';

import {
  SkyuxBrowserBuilderOptions
} from './browser-options';

import {
  getBrowserTransforms
} from './browser-transforms';

async function executeSkyuxBrowserBuilder(
  options: SkyuxBrowserBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {

  await executeBrowserBuilder(options, context, getBrowserTransforms()).toPromise();

  return new Promise(resolve => {
    const dist = path.resolve(process.cwd(), 'dist/builders-test');

    const app = express();
    app.use(cors());
    app.use(express.static(dist));

    const server = https.createServer({
      cert: fs.readFileSync(getCertPath('skyux-server.crt')),
      key: fs.readFileSync(getCertPath('skyux-server.key'))
    }, app);

    const port = 4200;
    server.listen(port, 'localhost', () => {
      console.log(`Serving local files at https://localhost:${port}/.`);

      openHostUrl(
        'https://app.blackbaud.com/',
        'builders-test-app',
        {
        localUrl: `https://localhost:${port}/`,
        scripts: fs.readJsonSync(path.resolve(dist, 'metadata.json'))
      });
    });

    server.on('exit', () => {
      console.log('EXIT!');
      resolve({
        success: true
      });
    });
  });
}

export default createBuilder<JsonObject & SkyuxBrowserBuilderOptions>(
  executeSkyuxBrowserBuilder
);
