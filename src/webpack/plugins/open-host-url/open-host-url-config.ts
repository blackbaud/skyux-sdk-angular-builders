import { SkyuxConfigExternals } from './config-externals';
import {SkyuxConfigHostBBCheckout} from './config-host-bb-checkout';
import {SkyuxConfigHostFrameOptionsNone, SkyuxConfigHostFrameOptionsOthers} from './config-host-frame-options';

export interface SkyuxOpenHostUrlPluginConfig {

  externals?: SkyuxConfigExternals;

  bbCheckout?: SkyuxConfigHostBBCheckout;

  frameOptions?: SkyuxConfigHostFrameOptionsNone | SkyuxConfigHostFrameOptionsOthers;

  /**
   * The URL of the SKY UX Host server.
   */
  hostUrl: string;

  /**
   * The URL of the localhost server, serving the asset files.
   */
  localUrl: string;

  /**
   * Specifies if the URL should be opened in the default browser automatically.
   */
  open: boolean;

  /**
   * The unique pathname of the SPA, e.g. 'my-spa'.
   */
  pathName: string;

}
