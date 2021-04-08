import cors from 'cors';
import express from 'express';
import https from 'https';
import portfinder from 'portfinder';

import { readCert } from '../../shared/cert-utils';

import { SkyuxServerConfig } from './server-config';

export class SkyuxServer {
  private server: https.Server | undefined;

  private onExitCallbacks: (() => void)[] = [];

  constructor(config: SkyuxServerConfig) {
    const app = express();
    app.use(cors());
    app.use(config.rootPath, express.static(config.distPath));

    const options = {
      cert: readCert(config.sslCert),
      key: readCert(config.sslKey)
    };

    this.server = https.createServer(options, app);
    process.on('exit', () => {
      this.stop();
    });
  }

  public async start(): Promise<number> {
    const port = await portfinder.getPortPromise();
    console.log(`Serving build results to https://localhost:${port}/`);
    await this.server?.listen(port);
    return port;
  }

  public stop(): void {
    if (this.server) {
      console.log('Stopping build server...');
      this.server.close();
      this.server = undefined;
      this.onExitCallbacks.forEach((onExitCallback) => onExitCallback());
      this.onExitCallbacks = [];
      console.log('Server stopped.');
    }
  }

  public onExit(callback: () => void): void {
    this.onExitCallbacks.push(callback);
  }
}
