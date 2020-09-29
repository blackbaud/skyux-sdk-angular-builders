import {
  DevServerBuilderOptions
} from '@angular-devkit/build-angular';

import {
  SkyuxBuilderOptions
} from '../builder-options';

export type SkyuxDevServerBuilderOptions = DevServerBuilderOptions & SkyuxBuilderOptions;
