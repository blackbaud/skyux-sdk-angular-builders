import {
  KarmaBuilderOptions
} from '@angular-devkit/build-angular';

import {
  json
} from '@angular-devkit/core';

export type SkyuxKarmaBuilderOptions = KarmaBuilderOptions & json.JsonObject & {

  /**
   * The name of the continuous integration platform that will run the tests.
   */
  skyuxCiPlatform?: 'ado' | 'gh-actions';

  /**
   * Specifies the minimum required code coverage threshold.
   */
  skyuxCodeCoverageThreshold: 'none' | 'standard' | 'strict'

};
