import {
  BuilderContext
} from '@angular-devkit/architect';

import {
  AngularCompilerPlugin
} from '@ngtools/webpack';

import {
  resolve
} from 'path';

import {
  Configuration
} from 'webpack';

import {
  AssetStateRunnerPlugin
} from '../webpack/plugins/asset-state-runner';

import {
  SaveMetadataPlugin
} from '../webpack/plugins/save-metadata';

import {
  OpenSKYUXHostPlugin
} from '../webpack/plugins/open-skyux-host';

import {
  Transforms
} from './transforms.model';

export function skyuxWebpackConfigFactory(
  options: any,
  context: BuilderContext,
  transforms: Transforms
) {

  transforms.webpackConfiguration = (config: Configuration) => {

    if (context.builder.builderName === 'dev-server') {
      config.plugins?.push(new OpenSKYUXHostPlugin(options, context));
    }

    if (context.builder.builderName === 'browser') {
      config.module?.rules?.push({
        // https://github.com/angular/angular-cli/issues/16544#issuecomment-571245469
        enforce: 'pre',
        test: /.ts$/,
        use: resolve(__dirname, '../webpack/loaders/assets-in-ts')
      });

      config.module?.rules?.push({
        test: /.html$/,
        use: [
          'raw-loader',
          resolve(__dirname, '../webpack/loaders/assets-in-html')
        ]
      });

      config.plugins?.push(
        new AssetStateRunnerPlugin(),
        new SaveMetadataPlugin()
      );

      config.plugins?.some((plugin) => {
        if (plugin instanceof AngularCompilerPlugin) {
          (plugin as AngularCompilerPlugin).options.directTemplateLoading = false;
          return true;
        }
      });
    }

    return config;
  }
}
