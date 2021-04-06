import cors from 'cors';

import express from 'express';

import fs from 'fs-extra';

import https from 'https';

import path from 'path';

import { SkyuxServerConfig } from './server-config';

function createApp(rootPath: string, baseHref: string) {
  const app = express();

  app.use(cors());
  app.use(express.static(rootPath));

  const rootDir = path.basename(rootPath);
  console.log(`Mapping server requests from ${rootDir} to ${baseHref}`);
  app.use(rootDir, express.static(baseHref));

  return app;
}

export function createServer(config: SkyuxServerConfig): Promise<void> {
  const app = createApp(config.rootDir, config.baseHref);

  const server = https.createServer(
    {
      cert: fs.readFileSync(config.sslCert),
      key: fs.readFileSync(config.sslKey)
    },
    app
  );

  return new Promise(async (resolve, reject) => {
    server.on('error', reject);

    await server.listen(config.port);

    console.log(`Serving local files on https://localhost:${config.port}/.`);

    process.on('exit', () => {
      server.close();
    });

    resolve();
  });
}
