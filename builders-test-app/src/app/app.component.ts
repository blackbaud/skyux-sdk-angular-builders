import {
  Component,
  OnInit
} from '@angular/core';

import {
  SkyAppAssetsService
} from '@skyux/assets';

import {
  SkyAppConfigHost,
  SkyAppParamsConfig,
  SkyAppRuntimeConfigParamsProvider
} from '@skyux/config';

import {
  SkyAppTitleService
} from '@skyux/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'builders-test-app';

  constructor(
    private titleSvc: SkyAppTitleService,
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

  public ngOnInit(): void {
    this.titleSvc.setTitle({
      titleParts: ['Builders Test App']
    });
  }
}
