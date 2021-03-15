import {
  Compiler
} from 'webpack';

import {
  applyProtractorEnvironmentConfig
} from '../../../../builders/protractor/protractor-environment-utils';

const PLUGIN_NAME = 'skyux-protractor-plugin';

/**
 * Saves the fully-formed SKY UX Host URL to the Protractor environment config.
 */
export class SkyuxProtractorPlugin {
  constructor(
    private config: {
      hostUrlFactory: () => Promise<string>
    }
  ) { }

  public apply(compiler: Compiler): void {
    compiler.hooks.done.tapPromise(PLUGIN_NAME, async (_args) => {
      const skyuxHostUrl = await this.config.hostUrlFactory();
      applyProtractorEnvironmentConfig({
        skyuxHostUrl
      });
    });
  }
}
