import cors from 'cors';
import express from 'express';
import https from 'https';

import { readCert } from '../../shared/cert-utils';
import { getAvailablePort } from '../../shared/port-finder';

import { SkyuxServerConfig } from './server-config';

export class SkyuxServer {
  private onExitCallbacks: (() => void)[] = [];

  private server: https.Server | undefined;

  constructor(config: SkyuxServerConfig) {
    const app = express();
    app.use(cors());
    app.use(config.rootPath, express.static(config.distPath));
    this.server = https.createServer(
      {
        cert: readCert(config.sslCert),
        key: readCert(config.sslKey)
      },
      app
    );
  }

  public async start(): Promise<number> {
    const port = await getAvailablePort();

    console.log(`Serving build results to https://localhost:${port}/`);

    await this.server!.listen(port);

    process.on('exit', () => this.stop());

    return port;
  }

  public onExit(callback: () => void): void {
    this.onExitCallbacks.push(callback);
  }

  private stop(): void {
    console.log('Stopping build server...');
    this.server!.close();
    this.server = undefined;
    this.onExitCallbacks.forEach((onExitCallback) => onExitCallback());
    this.onExitCallbacks = [];
    console.log('Server stopped.');
  }
}
