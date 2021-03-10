import {
  SkyuxConfigExternals
} from './config-externals';

import {
  SkyuxConfigHost
} from './config-host';

interface SkyuxHostUrlScript {
  name: string;
}

/**
 * Configuration that is encoded as part of the SKY UX Host URL.
 */
export interface SkyuxHostUrlConfig {

  externals?: SkyuxConfigExternals;

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
  scripts?: SkyuxHostUrlScript[];

  /**
   * Options specific to the host platform.
   */
  host: SkyuxConfigHost;

}
