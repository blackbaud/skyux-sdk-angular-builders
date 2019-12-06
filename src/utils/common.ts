import {
  BuilderContext
} from '@angular-devkit/architect';

import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

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
} from '../webpack-plugin-done';

type SkyWebpackConfigTransformFactory = (options: SkyBuilderOptions, context: BuilderContext) => ExecutionTransformer<WebpackConfiguration>;

export const webpackConfigTransformFactory: SkyWebpackConfigTransformFactory = (options: SkyBuilderOptions, context: BuilderContext) => {
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

export function getTransforms(options: SkyBuilderOptions, context: BuilderContext): SkyBuilderTransforms {
  return {
    webpackConfiguration: webpackConfigTransformFactory(options, context)
  };
}
