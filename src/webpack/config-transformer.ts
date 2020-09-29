import {
  BuilderContext
} from '@angular-devkit/architect';

import {
  ExecutionTransformer
} from '@angular-devkit/build-angular';

import {
  Configuration as WebpackConfig
} from 'webpack';

import {
  SkyuxOpenHostURLPlugin
} from './plugins/open-host-url';


/**
 * Allows adjustments to the default Angular webpack config.
 * @param options The input options passed to the builder.
 * @param context The context of the builder execution.
 */
export function getWepbackConfigTransformer(
  options: any,
  context: BuilderContext
): ExecutionTransformer<WebpackConfig> {

  return (webpackConfig) => {

    if (context.builder.builderName === 'dev-server') {
      if (options.skyuxOpen === 'host') {
        webpackConfig.plugins?.push(
          new SkyuxOpenHostURLPlugin(
            context.target?.project as string,
            {
              browser: options.skyuxOpenBrowser,
              hostUrl: options.skyuxHostUrl as string,
              localUrl: options.skyuxLocalUrl as string
            }
          )
        );
      }
    }

    return webpackConfig;

  };

}
