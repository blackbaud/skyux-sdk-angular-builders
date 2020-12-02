import {
  KarmaBuilderOptions
} from '@angular-devkit/build-angular';

import {
  json
} from '@angular-devkit/core';

export type SkyuxKarmaBuilderOptions = KarmaBuilderOptions & json.JsonObject & {

  skyuxCiPlatform?: 'ado' | 'gh-actions';

  skyuxCodeCoverageThreshold: 'none' | 'standard' | 'strict'

};
