import {
  SkyuxConfigAppExternals,
  SkyuxConfigHost
} from '../../../../shared/skyux-config';

/**
 * Configuration parameter `_cfg` that is encoded as part of the SKY UX Host URL.
 */
export interface SkyuxCreateHostUrlConfig {

  externals?: SkyuxConfigAppExternals;

  host?: SkyuxConfigHost;

  /**
   * The URL of the localhost server, serving the asset files.
   */
  localUrl: string;

  /**
   * The name of the root element for the application to bootstrap.
   */
  rootElementTagName?: string;

  /**
   * An array of JavaScript file names to inject into Host's index.html file.
   * These files should only reference initial chunks. (Lazyloaded chunks are handled locally.)
   */
  scripts?: {
    name: string;
  }[];

}
