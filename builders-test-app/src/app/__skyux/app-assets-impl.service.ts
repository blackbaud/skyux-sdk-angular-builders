/* tslint:disable */
/**
 * DO NOT MODIFY!
 * This file is handled by the `@skyux-sdk/angular-builders` Angular CLI builder.
 */

import {
  Injectable
} from '@angular/core';

import assetsMap from './app-assets-map.json';

@Injectable({
  providedIn: 'root'
})
export class SkyAppAssetsImplService {

  private get assetsMap(): {[_: string]: string} {
    return assetsMap;
  }

  public getUrl(filePath: string): string {
    return this.assetsMap[filePath];
  }

  public getAllUrls(): {[key: string]: string} {
    return this.assetsMap;
  }

}
