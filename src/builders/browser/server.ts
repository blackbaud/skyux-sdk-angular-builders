import cors from 'cors';
import express from 'express';
import fs from 'fs-extra';
import { RequestListener } from 'http';
import https from 'https';

import { SkyuxServerConfig } from './server-config';

/**
 * Serves `ng build` artifacts for local development.
 */
export class SkyuxServer {
  private server: https.Server | undefined;

  constructor(private config: SkyuxServerConfig) {
    const app = this.createApp();
    this.server = this.createServer(app);
  }

  public start(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.server?.on('error', (err) => {
        reject(err);
      });

      console.log(
        `Serving local files on https://localhost:${this.config.port}/.`
      );

      await this.server?.listen(this.config.port);

      resolve();
    });
  }

  public stop(): void {
    if (this.server) {
      console.log('Server stopped.');
      this.server.close();
      this.server = undefined;
    }
  }

  private createApp() {
    const distPath = this.config.distPath;
    const rootPath = this.config.rootPath;
    const app = express();

    app.use(cors());
    app.use(rootPath, express.static(distPath));

    return app;
  }

  private createServer(app: RequestListener): https.Server {
    return https.createServer(
      {
        cert: fs.readFileSync(this.config.sslCert),
        key: fs.readFileSync(this.config.sslKey)
      },
      app
    );
  }
}
