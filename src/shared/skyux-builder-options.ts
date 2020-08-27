import {
  BrowserBuilderOptions,
  DevServerBuilderOptions
} from '@angular-devkit/build-angular';

import {
  SkyuxConfig
} from './skyux-config';

export interface SkyuxBuilderOptions {
  skyuxAssetsBaseUrl?: string;

  // Consider moving these back in to skyuxConfig
  skyuxHostUrl: string;
  skyuxLocalUrl: string;

  skyuxOpen?: "host" | "local";
  skyuxOpenBrowser?: string | string[];
  skyuxConfig?: SkyuxConfig;
}

export type SkyuxBrowserBuilderOptions = BrowserBuilderOptions & SkyuxBuilderOptions;

export type SkyuxDevServerBuilderOptions = DevServerBuilderOptions & SkyuxBuilderOptions;