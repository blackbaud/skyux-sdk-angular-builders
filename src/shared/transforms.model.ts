import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  WebpackLoggingCallback
} from '@angular-devkit/build-webpack';

import {
  Configuration
} from 'webpack';

export interface Transforms {
  webpackConfiguration?: ExecutionTransformer<Configuration>;
  logging?: WebpackLoggingCallback;
  // Possibly useful to us in the future?
  // indexHtml?: IndexHtmlTransform;
}
