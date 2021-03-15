import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';

import {
  executeProtractorBuilder
} from '@angular-devkit/build-angular';

import path from 'path';

import {
  getSkyuxConfig
} from '../../shared/skyux-config-utils';

import {
  applyProtractorEnvironmentConfig
} from './protractor-environment-utils';

import {
  SkyuxProtractorBuilderOptions
} from './protractor-options';

function executeSkyuxProtractorBuilder(
  options: SkyuxProtractorBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {
  const skyuxConfig = getSkyuxConfig();

  options.skyuxHeadless = !!options.skyuxHeadless;
  options.protractorConfig = path.join(__dirname, 'protractor.default.conf.js');

  applyProtractorEnvironmentConfig({
    builderOptions: options,
    skyuxHostUrl: skyuxConfig.host.url
  });

  return executeProtractorBuilder(
    options,
    context
  );
}

export default createBuilder<SkyuxProtractorBuilderOptions>(
  executeSkyuxProtractorBuilder
);
