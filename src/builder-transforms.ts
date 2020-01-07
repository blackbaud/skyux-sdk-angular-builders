import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  IndexHtmlTransform
} from '@angular-devkit/build-angular/src/angular-cli-files/utilities/index-file/write-index-html';

import {
  Configuration as WebpackConfiguration
} from 'webpack';

export interface SkyBuilderTransforms {
  webpackConfiguration?: ExecutionTransformer<WebpackConfiguration>;
  indexHtml?: IndexHtmlTransform;
}
