import {
  DevServerBuilderOptions
} from '@angular-devkit/build-angular';

export type SkyuxDevServerBuilderOptions = DevServerBuilderOptions & {

  skyuxHostUrl?: string;

  skyuxLaunch?: 'host' | 'local';

};
