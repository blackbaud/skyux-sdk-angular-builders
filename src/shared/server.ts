import cors from 'cors';
// import events from 'events';
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

    const localUrl = `https://localhost:${port}/`;
    // const metadata = fs.readJsonSync(path.resolve(config.rootDirectory, 'metadata.json'));

    console.log(`Serving local files on ${localUrl}.`);

    // openHostUrl(
    //   config.hostUrl,
    //   config.pathName,
    //   {
    //     localUrl,
    //     scripts: metadata
    //   }
    // );

    process.on('exit', () => {
      server.close();
    });

    resolve(port);
  });
}
