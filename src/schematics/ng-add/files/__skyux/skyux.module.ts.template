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
  RuntimeConfig,
  SkyAppConfig,
  SkyAppConfigModule,
  SkyAppRuntimeConfigParamsProvider,
  SkyuxConfig
} from '@skyux/config';

import {
  SkyAppTitleService,
  SkyAppWindowRef,
  SkyViewkeeperHostOptions
} from '@skyux/core';

import {
  SkyThemeModule,
  SkyThemeService
} from '@skyux/theme';

import skyAppConfigJson from './skyappconfig.json';
const skyAppConfig: {
  runtime: RuntimeConfig,
  skyux: SkyuxConfig
} = skyAppConfigJson as any;

import {
  ShellComponent
} from './shell/shell.component';

import {
  SkyAppAssetsImplService
} from './app-assets-impl.service';

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
      host: skyAppConfig.skyux.host,
      params: skyAppConfig.skyux.params
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
        SkyThemeService,
        {
          provide: SkyAppAssetsService,
          useClass: SkyAppAssetsImplService
        },
        {
          provide: SkyAppConfig,
          useFactory: (paramsProvider: SkyAppRuntimeConfigParamsProvider) => {
            const config = new SkyAppConfig();
            config.runtime = skyAppConfig.runtime;
            config.skyux = skyAppConfig.skyux;

            config.runtime.params = paramsProvider.params;

            return config;
          },
          deps: [SkyAppRuntimeConfigParamsProvider]
        },
        {
          provide: SkyAppTitleService,
          useFactory: (title: Title) => {
            if (skyAppConfig.skyux.omnibar) {
              return new SkyAppOmnibarTitleService();
            }

            return new SkyAppTitleService(title);
          },
          deps: [Title]
        },
        {
          provide: SkyViewkeeperHostOptions,
          deps: [
            SkyAppRuntimeConfigParamsProvider
          ],
          useFactory: (
            runtimeParams: SkyAppRuntimeConfigParamsProvider
          ) => {
            const omnibarExists = skyAppConfig.skyux.omnibar && runtimeParams.params.get('addin') !== '1';

            const hostOptions = new SkyViewkeeperHostOptions();
            hostOptions.viewportMarginTop = omnibarExists ? 50 : 0;

            return hostOptions;
          }
        }
      ]
    };
  }
}
