/**
 * Configuration that is passed to the SKY UX Host server.
 */
export interface SkyuxHostConfig {

  /**
   * The URL of the localhost server, serving the asset files.
   */
  localUrl: string;

  /**
   * The name of the root element for the application to bootstrap.
   */
  rootElementTagName: string;

  /**
   * An array of JavaScript file names to inject into Host's index.html file.
   */
  scripts: {
    name: string;
  }[];
}
