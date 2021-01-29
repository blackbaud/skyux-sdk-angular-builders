import { Component } from '@angular/core';
import { SkyAppAssetsService } from '@skyux/assets';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'builders-test-app';

  constructor(
    assetService: SkyAppAssetsService
  ) {
    console.log('Asset URLs:', assetService.getAllUrls());
  }
}
