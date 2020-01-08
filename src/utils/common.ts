import {
  BuilderContext
} from '@angular-devkit/architect';

import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  IndexHtmlTransform
} from '@angular-devkit/build-angular/src/angular-cli-files/utilities/index-file/write-index-html';

import {
  Configuration as WebpackConfiguration
} from 'webpack';

import {
  smartStrategy
} from 'webpack-merge';

import {
  SkyBuilderOptions
} from '../builder-options';

import {
  SkyBuilderTransforms
} from '../builder-transforms';

import {
  SkyWebpackPluginDone
} from './webpack-plugin-done';

type SkyWebpackConfigTransformFactory = (
  options: SkyBuilderOptions,
  context: BuilderContext
) => ExecutionTransformer<WebpackConfiguration>;

export const webpackConfigTransformFactory: SkyWebpackConfigTransformFactory = (
  options: SkyBuilderOptions,
  context: BuilderContext
) => {
  return (defaultWebpackConfig) => {
    let customConfig: WebpackConfiguration = {};
    if (context.target && context.target.target === 'serve') {
      customConfig = {
        plugins: [
          new SkyWebpackPluginDone(options)
        ]
      };
    }

    const merged = smartStrategy({})(defaultWebpackConfig, customConfig);
    return merged;
  };
};

export const indexHtmlTransformFactory: (
  context: BuilderContext
) => IndexHtmlTransform = ({ target }) => {
  const { transform } = require('@skyux-sdk/angular-builders/src/transform-index-html.js');
  return async (indexHtml: string) => transform(target, indexHtml);
};

export function getTransforms(options: SkyBuilderOptions, context: BuilderContext): SkyBuilderTransforms {
  return {
    indexHtml: indexHtmlTransformFactory(context),
    webpackConfiguration: webpackConfigTransformFactory(options, context)
  };
}
