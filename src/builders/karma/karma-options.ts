import {
  KarmaBuilderOptions
} from '@angular-devkit/build-angular';

import {
  json
} from '@angular-devkit/core';

export type SkyuxKarmaBuilderOptions = KarmaBuilderOptions & json.JsonObject & {
  skyuxCIPlatform?: 'ado' | 'gh-actions';
};
