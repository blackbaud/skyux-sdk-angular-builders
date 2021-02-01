// DO NOT MODIFY
// This file is handled by the `@skyux-sdk/angular-builders` library.
/* tslint:disable */

import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class SkyAppAssetsImplService {
  private __SKYUX_APP_ASSETS_VALUES: {[key: string]: any} = {};
  public getUrl(filePath: string): string {
    return this.__SKYUX_APP_ASSETS_VALUES[filePath];
  }
  public getAllUrls(): {[key: string]: string} {
    return this.__SKYUX_APP_ASSETS_VALUES;
  }
}
