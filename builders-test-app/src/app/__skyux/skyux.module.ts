import {
  ModuleWithProviders,
  NgModule
} from '@angular/core';

import {
  SkyAppAssetsService
} from '@skyux/assets';

import {
  SkyAppAssetsImplService
} from './app-assets-impl.service';

@NgModule({})
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
