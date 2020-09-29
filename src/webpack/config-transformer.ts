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

import {
  SkyuxSaveMetadataPlugin
} from './plugins/save-metadata';

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

    switch (context.builder.builderName) {
      case 'browser':
        webpackConfig.plugins?.push(
          new SkyuxSaveMetadataPlugin()
        );
        break;

      case 'dev-server':
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
        break;
    }

    return webpackConfig;

  };

}
