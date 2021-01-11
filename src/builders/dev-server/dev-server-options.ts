import {
  DevServerBuilderOptions
} from '@angular-devkit/build-angular';

/**
 * The input options passed to the builder.
 */
export type SkyuxDevServerBuilderOptions = DevServerBuilderOptions & {

  skyuxHostUrl?: string;

  /**
   * Specifies whether or not the app should be launched with the SKY UX Host server or the localhost server.
   */
  skyuxLaunch?: 'host' | 'local';

  /**
   * Specifies if the SKY UX Host URL should be automatically opened in the user's default browser.
   */
  skyuxOpen?: boolean;

};
