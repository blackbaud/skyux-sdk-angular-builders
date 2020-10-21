import cors from 'cors';

import express from 'express';

import fs from 'fs-extra';

import https from 'https';

import {
  getCertPath
} from './cert-utils';

import {
  getAvailablePort
} from './url-utils';

interface SkyuxServerConfig {
  rootDir: string;
}

function createApp(rootDirectory: string) {
  const app = express();
  app.use(cors());
  app.use(express.static(rootDirectory));
  return app;
}

export function createServer(config: SkyuxServerConfig): Promise<number> {

  const app = createApp(config.rootDir);

  const server = https.createServer({
    cert: fs.readFileSync(getCertPath('skyux-server.crt')),
    key: fs.readFileSync(getCertPath('skyux-server.key'))
  }, app);

  return new Promise(async (resolve, reject) => {
    server.on('error', reject);

    const port = await getAvailablePort();

    await server.listen(port);

    console.log(`Serving local files on https://localhost:${port}/.`);

    process.on('exit', () => {
      server.close();
    });

    resolve(port);
  });
}
