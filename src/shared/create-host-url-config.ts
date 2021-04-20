import { SkyuxHostAsset } from './host-asset';
import { SkyuxConfigHost } from './skyux-config';
import { SkyuxConfigAppExternals } from './skyux-config-app-externals';

/**
 * Configuration parameter `_cfg` that is encoded as part of the SKY UX Host URL.
 */
export interface SkyuxCreateHostUrlConfig {
  externals?: SkyuxConfigAppExternals | undefined;

  host: SkyuxConfigHost;

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
  scripts?: SkyuxHostAsset[];

  /**
   * An array of CSS file names to inject into Host's index.html file.
   */
  stylesheets?: SkyuxHostAsset[];
}
