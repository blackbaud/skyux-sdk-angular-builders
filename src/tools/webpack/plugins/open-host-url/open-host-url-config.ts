import {
  SkyuxConfigAppExternals,
  SkyuxConfigHost
} from '../../../../shared/skyux-config';

export interface SkyuxOpenHostUrlPluginConfig {

  /**
   * The unique base HREF of the SPA, e.g. 'my-spa'.
   */
   baseHref: string;

  externals?: SkyuxConfigAppExternals;

  host: SkyuxConfigHost;

  /**
   * The URL of the localhost server, serving the asset files.
   */
  localUrl: string;

  /**
   * Specifies if the URL should be opened in the default browser automatically.
   */
  open: boolean;

}
