import {
  BrowserBuilderOptions
} from '@angular-devkit/build-angular';

export type SkyuxBrowserBuilderOptions = BrowserBuilderOptions & {

  skyuxHostUrl?: string;

};
