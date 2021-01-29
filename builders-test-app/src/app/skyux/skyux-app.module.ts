import { NgModule } from '@angular/core';
import { SkyAppAssetsService } from '@skyux/assets';
import { SkyAppAssetsImplService } from './app-assets-impl.service';

@NgModule({
  providers: [
    {
      provide: SkyAppAssetsService,
      useClass: SkyAppAssetsImplService
    }
  ],
})
export class SkyuxAppModule { }
