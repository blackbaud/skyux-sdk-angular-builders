import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfiguration
} from 'webpack';

export interface SkyBuilderTransforms {
  webpackConfiguration?: ExecutionTransformer<WebpackConfiguration>;
}
