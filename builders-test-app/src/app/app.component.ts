import { Component } from '@angular/core';
import { SkyAppAssetsService } from '@skyux/assets';
import { SkyAppConfigHost, SkyAppParamsConfig, SkyAppRuntimeConfigParamsProvider } from '@skyux/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'builders-test-app';

  constructor(
    assetService: SkyAppAssetsService,
    hostConfig: SkyAppConfigHost,
    paramsConfig: SkyAppParamsConfig,
    runtimeParams: SkyAppRuntimeConfigParamsProvider
  ) {
    console.log('Asset URLs:', assetService.getAllUrls());
    console.log('Host config:', hostConfig);
    console.log('Params config:', paramsConfig);
    console.log('Runtime params:', runtimeParams.params.getAll());
  }
}
