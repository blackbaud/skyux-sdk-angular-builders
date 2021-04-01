import {
  DevServerBuilderOptions
} from '@angular-devkit/build-angular';

/**
 * The input options passed to the builder.
 */
export type SkyuxDevServerBuilderOptions = DevServerBuilderOptions & {

  /**
   * Specifies if the SKY UX Host URL should be automatically opened in the user's default browser.
   */
  skyuxOpen?: boolean;

};
