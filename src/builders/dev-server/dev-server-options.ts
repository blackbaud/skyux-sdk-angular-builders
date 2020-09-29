import {
  DevServerBuilderOptions
} from '@angular-devkit/build-angular';

export type SkyuxDevServerBuilderOptions = DevServerBuilderOptions & {

  skyuxHostUrl?: string;

  skyuxLocalUrl?: string;

  skyuxOpen?: 'host' | 'local';

  skyuxOpenBrowser?: string | string[];

};
