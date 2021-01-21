import { by, element } from 'protractor';

import { SkyHostBrowser } from '@skyux-sdk/e2e';

export class AppPage {
  async navigateTo(path: string = ''): Promise<unknown> {
    return SkyHostBrowser.get(path);
  }

  async getTitleText(): Promise<string> {
    return element(by.css('app-root .content span')).getText();
  }
}
