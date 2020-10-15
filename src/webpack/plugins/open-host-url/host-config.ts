/**
 * Configuration that is passed to the SKY UX Host server.
 */
export interface SkyuxHostConfig {

  /**
   * An array of JavaScript file names to inject into Host's index.html file.
   */
  scripts: {
    name: string;
  }[];

  /**
   * The URL of the localhost server, serving the asset files.
   */
  localUrl: string;

  /**
   * Config specific to the SKY UX Host platform.
   */
  host: {
    /**
     * The name of the root element for the application to bootstrap.
     */
    rootElementTagName: string;
  };
}
