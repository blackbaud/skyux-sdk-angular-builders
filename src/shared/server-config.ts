export interface SkyuxServerConfig {
  /**
   * The location of static files to serve.
   */
  distPath: string;

  /**
   * The server's port.
   */
  port: number;

  /**
   * The server's root path.
   */
  rootPath: string;

  /**
   * The path of the SSL certificate.
   */
  sslCert: string;

  /**
   * The path of the SSL certificate key.
   */
  sslKey: string;
}
