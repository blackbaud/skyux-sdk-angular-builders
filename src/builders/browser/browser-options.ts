import {
  BrowserBuilderOptions
} from '@angular-devkit/build-angular';

export type SkyuxBrowserBuilderOptions = BrowserBuilderOptions & {

  /**
   * Pass this value to Angular CLI's `deployUrl` so that lazyloaded chunks are pulled from the CDN.
   * TODO: We'll need some way to deliniate "entry" scripts and "lazyloaded" chunks when
   * sending the files to the CDN (via skyux-deploy).
   * TODO: Do we really need this?? Couldn't the pipeline just run `ng build --deployUrl "https://sky.blackbaudcdn.net/skyuxapps/$(SPAId)"`?
   */
  skyuxAssetsBaseUrl: string;

};
