import {
  JsonObject
} from '@angular-devkit/core';

/**
 * The input options passed to the builder.
 */
export type SkyuxDevServerBuilderOptions = JsonObject & {

  /**
   * The URL of the SKY UX Host server.
   */
  hostUrl?: string;

  /**
   * Specifies whether or not the app should be launched with the SKY UX Host server or the localhost server.
   */
  launch?: 'host' | 'local';

};
