import { BehaviorSubject, Observable } from 'rxjs';

import { Compiler } from 'webpack';
import { openHostUrl } from '../../../../shared/host-utils';

import { getHostAssets } from '../../host-asset-utils';

import { SkyuxOpenHostUrlPluginConfig } from './open-host-url-config';

const PLUGIN_NAME = 'open-skyux-host-plugin';

export class SkyuxOpenHostUrlPlugin {
  /**
   * The fully-formed SKY UX Host URL.
   */
  public get $hostUrl(): Observable<string> {
    return this._$hostUrl.asObservable();
  }

  private _$hostUrl = new BehaviorSubject<string>('');

  constructor(private config: SkyuxOpenHostUrlPluginConfig) {}

  public apply(compiler: Compiler): void {
    let opened = false;

    compiler.hooks.done.tap(PLUGIN_NAME, (webpackStats) => {
      if (!opened) {
        const assets = getHostAssets(webpackStats.toJson());

        const url = openHostUrl({
          assets,
          baseHref: this.config.baseHref,
          externals: this.config.externals,
          host: this.config.host,
          localUrl: this.config.localUrl
        });

        this._$hostUrl.next(url);

        opened = true;
      }
    });
  }
}
