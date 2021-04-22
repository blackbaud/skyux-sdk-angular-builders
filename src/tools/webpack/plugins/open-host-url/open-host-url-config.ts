import { SkyuxConfigHost } from '../../../../shared/skyux-config';
import { SkyuxConfigAppExternals } from '../../../../shared/skyux-config-app-externals';

export interface SkyuxOpenHostUrlPluginConfig {
  /**
   * The unique base href of the SPA, e.g. '/my-spa/'.
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
