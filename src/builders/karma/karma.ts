import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { executeKarmaBuilder, ExecutionTransformer, KarmaBuilderOptions } from '@angular-devkit/build-angular';
import { json } from '@angular-devkit/core';

import path from 'path';

import {
  Observable
} from 'rxjs';

import {
  Configuration as WebpackConfig,
  DefinePlugin
} from 'webpack';

export type SkyuxKarmaBuilderConfig = KarmaBuilderOptions;

function getWepbackConfigTransformer(
  context: BuilderContext
): ExecutionTransformer<WebpackConfig> {
  return (defaultWebpackConfig) => {

    console.log('Context:', context.builder);
    if (context.builder.builderName === 'karma') {
      const rootPath = JSON.stringify(path.resolve(process.cwd(), `projects/${context.target?.project}/src`));
      console.log('Root path:', rootPath);
      defaultWebpackConfig.plugins?.push(
        new DefinePlugin({
          SKYUX_KARMA_ROOT_PATH: rootPath
        })
      );
    }

    return defaultWebpackConfig;
  };
}

function skyuxKarma(
  options: SkyuxKarmaBuilderConfig,
  context: BuilderContext
): Observable<BuilderOutput> {
  console.log('In skyuxKarma...');
  const webpackConfiguration = getWepbackConfigTransformer(context);
  return executeKarmaBuilder(options, context, {
    webpackConfiguration
  });
}

export default createBuilder<json.JsonObject & SkyuxKarmaBuilderConfig>(skyuxKarma);
