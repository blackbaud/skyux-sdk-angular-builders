/* tslint:disable */

// DO NOT MODIFY
// This file is handled by the '@skyux-sdk/angular-builders' library.

import {
  CommonModule
} from '@angular/common';

import {
  ModuleWithProviders,
  NgModule
} from '@angular/core';

import {
  Title
} from '@angular/platform-browser';

import {
  SkyAppAssetsService
} from '@skyux/assets';

import {
  SkyAppConfigModule
} from '@skyux/config';

import {
  SkyAppTitleService,
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyThemeModule
} from '@skyux/theme';

import skyuxConfigJson from './processed-skyuxconfig.json';
const skyuxConfig: any = skyuxConfigJson;

import startupConfigJson from './startupconfig.json';
const startupConfig: any = startupConfigJson;

import {
  ShellComponent
} from './shell/shell.component';

import {
  SkyAppAssetsImplService
} from './app-assets-impl.service';

import {
  SkyuxStartupService
} from './startup.service';

import {
  SkyAppOmnibarTitleService
} from './omnibar/omnibar-title.service';

@NgModule({
  declarations: [
    ShellComponent
  ],
  exports: [
    ShellComponent
  ],
  imports: [
    CommonModule,
    SkyAppConfigModule.forRoot({
      host: skyuxConfig.host,
      params: skyuxConfig.params
    }),
    SkyThemeModule
  ]
})
export class SkyuxModule {
  public static forRoot(): ModuleWithProviders<SkyuxModule> {
    return {
      ngModule: SkyuxModule,
      providers: [
        SkyAppWindowRef,
        {
          provide: SkyAppAssetsService,
          useClass: SkyAppAssetsImplService
        },
        {
          provide: SkyuxStartupService,
          useFactory: () => {
            const svc = new SkyuxStartupService();
            svc.init(startupConfig);

            return svc;
          }
        },
        {
          provide: SkyAppTitleService,
          useFactory: (title: Title) => {
            if (startupConfig.omnibar) {
              return new SkyAppOmnibarTitleService();
            }

            return new SkyAppTitleService(title);
          },
          deps: [Title]
        }
      ]
    };
  }
}
