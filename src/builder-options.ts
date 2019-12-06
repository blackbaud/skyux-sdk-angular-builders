import {
  JsonObject,
  JsonValue
} from '@angular-devkit/core';

import {
  SkyAppExternalAssets
} from './external-assets';

export interface SkyBuilderOptions extends JsonObject {
  skyux: {
    app: {
      externals: SkyAppExternalAssets & JsonValue;
    },
    host: {
      url?: string;
    } & JsonValue;
    name: string;
  }
}
