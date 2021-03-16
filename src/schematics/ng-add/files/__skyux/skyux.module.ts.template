// DO NOT MODIFY
// This file is handled by the '@skyux-sdk/angular-builders' library.

import {
  ModuleWithProviders,
  NgModule
} from '@angular/core';

import {
  SkyAppAssetsService
} from '@skyux/assets';

import {
  SkyAppConfigModule
} from '@skyux/config';

import skyuxConfigJson from './processed-skyuxconfig.json';
const skyuxConfig: any = skyuxConfigJson;

import {
  SkyAppAssetsImplService
} from './app-assets-impl.service';

@NgModule({
  imports: [
    SkyAppConfigModule.forRoot({
      params: skyuxConfig.params,
      host: skyuxConfig.host
    })
  ]
})
export class SkyuxModule {
  public static forRoot(): ModuleWithProviders<SkyuxModule> {
    return {
      ngModule: SkyuxModule,
      providers: [
        {
          provide: SkyAppAssetsService,
          useClass: SkyAppAssetsImplService
        }
      ]
    };
  }
}
