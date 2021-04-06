import { Compiler } from 'webpack';

import { applyProtractorEnvironmentConfig } from '../../../../shared/protractor-environment-utils';
import { SkyuxProtractorPluginConfig } from './protractor-plugin-config';

const PLUGIN_NAME = 'skyux-protractor-plugin';

/**
 * Saves the fully-formed SKY UX Host URL to the Protractor environment config.
 */
export class SkyuxProtractorPlugin {
  constructor(
    private config: SkyuxProtractorPluginConfig
  ) {}

  public apply(compiler: Compiler): void {
    compiler.hooks.done.tapPromise(
      PLUGIN_NAME,
      async (_args) => {
        const skyuxHostUrl = await this.config.hostUrlFactory();
        applyProtractorEnvironmentConfig({
          skyuxHostUrl
        });
      }
    );
  }
}
