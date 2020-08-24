import {
  BrowserBuilderOptions,
  DevServerBuilderOptions
} from '@angular-devkit/build-angular';

export interface SkyuxBuilderOptions {
  skyuxAssetsBaseUrl?: string;
  skyuxHostUrl: string;
  skyuxLocalUrl: string;
  skyuxOpen?: "host" | "local";
}

export type SkyuxBrowserBuilderOptions = BrowserBuilderOptions & SkyuxBuilderOptions;

export type SkyuxDevServerBuilderOptions = DevServerBuilderOptions & SkyuxBuilderOptions;