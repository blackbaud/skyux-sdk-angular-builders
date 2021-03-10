import {
  SkyuxHostUrlConfigHost
} from './host-url-config-host';

import {
  SkyuxHostUrlConfigExternals
} from './host-url-config-externals';

import {
  SkyuxHostUrlConfigScript
} from './host-url-config-script';

/**
 * Configuration that is encoded as part of the SKY UX Host URL.
 */
export interface SkyuxHostUrlConfig {

  externals?: SkyuxHostUrlConfigExternals;

  /**
   * Options specific to the host platform.
   */
   host?: SkyuxHostUrlConfigHost;

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
  scripts?: SkyuxHostUrlConfigScript[];

}
