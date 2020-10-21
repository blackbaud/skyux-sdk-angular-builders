import cors from 'cors';
import express from 'express';
import fs from 'fs-extra';
import https from 'https';
import path from 'path';

import { getCertPath } from './cert-utils';

import { openHostUrl } from './host-utils';

interface SkyuxServerConfig {
  hostUrl: string;
  pathName: string;
  port: number;
}

export function createServer(config: SkyuxServerConfig): Promise<void> {
  const dist = path.resolve(process.cwd(), 'dist/builders-test');

  const app = express();
  app.use(cors());
  app.use(express.static(dist));

  const server = https.createServer(
    {
      cert: fs.readFileSync(getCertPath('skyux-server.crt')),
      key: fs.readFileSync(getCertPath('skyux-server.key'))
    },
    app
  );

  return new Promise(async (resolve, reject) => {
    server.on('error', reject);

    await server.listen(config.port);

    const localUrl = `https://localhost:${config.port}/`;
    console.log(`Serving local files at ${localUrl}.`);

    openHostUrl(
      config.hostUrl,
      config.pathName,
      {
        localUrl,
        scripts: fs.readJsonSync(path.resolve(dist, 'metadata.json'))
      }
    );

    process.on('SIGINT', () => {
      server.close();
      resolve();
      process.exit();
    });
  });
}
