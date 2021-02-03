import {
  NgModule
} from '@angular/core';

import {
  SkyAppAssetsService
} from '@skyux/assets';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyAppAssetsImplService
} from './app-assets-impl.service';

@NgModule({
  exports: [
    SkyI18nModule
  ],
  providers: [
    {
      provide: SkyAppAssetsService,
      useClass: SkyAppAssetsImplService
    }
  ]
})
export class __SkyuxModule { }
