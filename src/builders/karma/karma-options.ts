import {
  KarmaBuilderOptions
} from '@angular-devkit/build-angular';

import {
  json
} from '@angular-devkit/core';

import {
  SkyuxCIPlatform
} from './ci-platform';

import {
  SkyuxCodeCoverageThreshold
} from './code-coverage-threshold';

export type SkyuxKarmaBuilderOptions = KarmaBuilderOptions & json.JsonObject & {

  /**
   * The name of the continuous integration platform that will run the tests.
   */
  skyuxCiPlatform?: SkyuxCIPlatform;

  /**
   * Specifies the minimum required code coverage threshold.
   */
  skyuxCodeCoverageThreshold?: SkyuxCodeCoverageThreshold;

};
