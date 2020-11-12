import {
  BuilderContext
} from '@angular-devkit/architect';

import {
  ExecutionTransformer, KarmaConfigOptions
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  SkyuxKarmaBuilderOptions
} from './karma-options';

/**
 * Allows adjustments to the default Angular "karma" webpack config.
 * @param options The input options passed to the builder.
 * @param context The context of the builder execution.
 */
function getKarmaWepbackConfigTransformer(
  _options: SkyuxKarmaBuilderOptions,
  _context: BuilderContext
): ExecutionTransformer<WebpackConfig> {
  return (webpackConfig) => {
    // console.log('Context:', context.builder);
    // if (context.builder.builderName === 'karma') {
    //   const rootPath = JSON.stringify(path.resolve(process.cwd(), `projects/${context.target?.project}/src`));
    //   console.log('Root path:', rootPath);
    //   defaultWebpackConfig.plugins?.push(
    //     new DefinePlugin({
    //       SKYUX_KARMA_ROOT_PATH: rootPath
    //     })
    //   );
    // }
    return webpackConfig;
  };
}

export function getKarmaTransforms(
  options: SkyuxKarmaBuilderOptions,
  context: BuilderContext
) {
  return {
    webpackConfiguration: getKarmaWepbackConfigTransformer(options, context),
    karmaOptions: (karmaConfig: KarmaConfigOptions) => {
      console.log('Karma config:', karmaConfig);
      return karmaConfig;
    }
  };
}
