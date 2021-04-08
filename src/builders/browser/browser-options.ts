import { BrowserBuilderOptions } from '@angular-devkit/build-angular';

export type SkyuxBrowserBuilderOptions = BrowserBuilderOptions & {
  /**
   * Specifies if the build results should be served locally.
   */
  skyuxServe?: boolean;
};
