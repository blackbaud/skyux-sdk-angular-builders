export interface SkyuxServerConfig {
  /**
   * The server's root path.
   */
  rootPath: string;

  /**
   * The system path of the static assets to serve.
   */
  distPath: string;

  /**
   * The path of the SSL certificate.
   */
  sslCert: string;

  /**
   * The path of the SSL key.
   */
  sslKey: string;
}
