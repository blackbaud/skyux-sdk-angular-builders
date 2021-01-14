export interface SkyuxOpenHostURLPluginConfig {

  /**
   * The URL of the SKY UX Host server.
   */
  hostUrl: string;

  /**
   * The URL of the localhost server, serving the asset files.
   */
  localUrl: string;

  /**
   * Specifies if the URL should be opened in a browser automatically.
   */
  open: boolean;

  /**
   * The unique pathname of the SPA, e.g. 'my-spa'.
   */
  pathName: string;

}
