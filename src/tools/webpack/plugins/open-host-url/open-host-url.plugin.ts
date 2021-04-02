import open from 'open';

import {
  BehaviorSubject,
  Observable
} from 'rxjs';

import { Compiler } from 'webpack';

import { getHostAssets } from '../../host-asset-utils';

import { createHostUrl } from './create-host-url';

import { SkyuxCreateHostUrlConfig } from './create-host-url-config';

import { SkyuxOpenHostUrlPluginConfig } from './open-host-url-config';

const PLUGIN_NAME = 'open-skyux-host-plugin';

export class SkyuxOpenHostUrlPlugin {
  /**
   * The fully-formed SKY UX Host URL.
   */
  public get $hostUrl(): Observable<string> {
    return this._$hostUrl.asObservable();
  }

  private _$hostUrl = new BehaviorSubject<string>(
    ''
  );

  constructor(
    private config: SkyuxOpenHostUrlPluginConfig
  ) {}

  public apply(compiler: Compiler): void {
    let opened = false;

    compiler.hooks.done.tap(
      PLUGIN_NAME,
      (webpackStats) => {
        if (!opened) {
          const assets = getHostAssets(
            webpackStats.toJson()
          );

          const hostUrlConfig: SkyuxCreateHostUrlConfig = {
            host: this.config.host,
            localUrl: this.config.localUrl,
            rootElementTagName: 'app-root',
            scripts: assets.scripts,
            stylesheets: assets.stylesheets
          };

          if (this.config.externals) {
            hostUrlConfig.externals = this.config.externals;
          }

          const url = createHostUrl(
            this.config.host.url,
            this.config.baseHref,
            hostUrlConfig
          );

          this._$hostUrl.next(url);

          console.log(
            `\n\n==================\n SKY UX Host URL:\n==================\n\n${url}\n\n`
          );

          if (this.config.open) {
            open(url);
          }

          opened = true;
        }
      }
    );
  }
}
