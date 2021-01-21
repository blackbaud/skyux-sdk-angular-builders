import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

import { SkyVisual } from '@skyux-sdk/e2e';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', async () => {
    await page.navigateTo();
    expect(await page.getTitleText()).toEqual('builders-test-app app is running!');
    await SkyVisual.compareScreenshot('body', {
      screenshotName: 'foobar'
    });
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
