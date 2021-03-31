/* tslint:disable */
/* istanbul ignore file */

// DO NOT MODIFY
// This file is handled by the '@skyux-sdk/angular-builders' library.

import {
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';

import {
  NavigationEnd,
  Router
} from '@angular/router';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  HelpInitializationService
} from '@blackbaud/skyux-lib-help';

import {
  SkyAppConfigHost,
  SkyAppRuntimeConfigParamsProvider
} from '@skyux/config';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyAppOmnibarProvider,
  SkyAppOmnibarReadyArgs,
  SkyAppSearchResultsProvider
} from '@skyux/omnibar-interop';

import {
  SkyAppStyleLoader,
  SkyAppViewportService,
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkyuxStartupService
} from '../startup.service';

// Defined globally by the SKY UX Host service.
declare const BBAuthClient: any;
declare const SKYUX_HOST: any;

let omnibarLoaded: boolean;

function fixUpUrl(
  baseUrl: string,
  route: string,
  runtimeParams: SkyAppRuntimeConfigParamsProvider
): string {
  return runtimeParams.params.getUrl(baseUrl + route);
}

function fixUpNavItems(
  items: any[],
  baseUrl: string,
  runtimeParams: SkyAppRuntimeConfigParamsProvider
): void {
  for (const item of items) {
    if (!item.url && item.route) {
      item.url = fixUpUrl(baseUrl, item.route, runtimeParams);
    }

    if (item.items) {
      fixUpNavItems(item.items, baseUrl, runtimeParams);
    }
  }
}

function fixUpNav(
  nav: any,
  baseUrl: string,
  runtimeParams: SkyAppRuntimeConfigParamsProvider
): void {
  const services = nav.services;

  if (services && services.length > 0) {
    let foundSelectedService = false;

    for (const service of services) {
      if (service.items) {
        fixUpNavItems(service.items, baseUrl, runtimeParams);
      }

      if (service.selected) {
        foundSelectedService = true;
      }
    }

    if (!foundSelectedService) {
      services[0].selected = true;
    }
  }
}

@Component({
  selector: 'skyux-app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ShellComponent implements OnInit, OnDestroy {
  public isReady = false;

  private ngUnsubscribe = new Subject<any>();

  constructor(
    private router: Router,
    private windowRef: SkyAppWindowRef,
    private styleLoader: SkyAppStyleLoader,
    private zone: NgZone,
    private hostConfig: SkyAppConfigHost,
    private runtimeParams: SkyAppRuntimeConfigParamsProvider,
    private startupSvc: SkyuxStartupService,
    viewport: SkyAppViewportService,
    renderer: Renderer2,
    @Optional() private helpInitService?: HelpInitializationService,
    @Optional() private omnibarProvider?: SkyAppOmnibarProvider,
    @Optional() private searchProvider?: SkyAppSearchResultsProvider,
    @Optional() private themeSvc?: SkyThemeService
  ) {
    /* istanbul ignore else */
    if (themeSvc) {
      const themeSettings = this.getInitialThemeSettings();

      this.themeSvc?.init(
        document.body,
        renderer,
        themeSettings
      );
    }

    this.styleLoader.loadStyles()
      .then((result?: any) => {
        this.isReady = true;

        if (result && result.error) {
          console.log(result.error.message);
        }

        // Let the isReady property take effect on the CSS class that hides/shows
        // content based on when styles are loaded.
        setTimeout(() => {
          viewport?.visible.next(true);
        });
      });
  }

  public ngOnInit(): void {
    // Without this code, navigating to a new route doesn't cause the window to be
    // scrolled to the top like the browser does automatically with non-SPA navigation
    // when no route fragment is present.
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const urlTree = this.router.parseUrl(event.url);
        if (!urlTree.fragment) {
          this.windowRef.nativeWindow.scroll(0, 0);
        }
      }
    });

    this.initShellComponents();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    if (omnibarLoaded) {
      BBAuthClient.BBOmnibar.destroy();
      omnibarLoaded = false;
    }

    /* istanbul ignore else */
    if (this.themeSvc) {
      this.themeSvc.destroy();
    }
  }

  // Only pass params that omnibar config cares about
  // Internally we store as envid/svcid but auth-client wants envId/svcId
  private setParamsFromQS(omnibarConfig: any): void {
    const map: { [key: string]: string } = {
      envid: 'envId',
      leid: 'leId',
      svcid: 'svcId'
    };

    Object.keys(map).forEach((key: string) => {
      if (this.runtimeParams.params.has(key)) {
        omnibarConfig[map[key]] = this.runtimeParams.params.get(key);
      }
    });
  }

  private setOnSearch(omnibarConfig: any): void {
    if (this.searchProvider) {
      omnibarConfig.onSearch = (searchArgs: any) => {
        return this.searchProvider?.getSearchResults(searchArgs);
      };
    }
  }

  private setNav(omnibarConfig: any): void {
    const baseUrl: string =
      (
        this.hostConfig.host.url +
        this.startupSvc.config.baseHref.substr(0, this.startupSvc.config.baseHref.length - 1)
      ).toLowerCase();

    let nav: any;

    if (omnibarConfig.nav) {
      nav = omnibarConfig.nav;
      fixUpNav(nav, baseUrl, this.runtimeParams);
    } else {
      nav = omnibarConfig.nav = {};
    }

    nav.beforeNavCallback = (item: any) => {
      const url = item.url?.toLowerCase();

      if (
        url === baseUrl ||
        // Make sure the base URL is not simply a partial match of the base URL plus additional
        // characters after the base URL that are not "terminating" characters
        url?.indexOf(baseUrl + '/') === 0 ||
        url?.indexOf(baseUrl + '?') === 0
      ) {
        const routePath = item.url?.substring(baseUrl.length, url.length);

        if (routePath) {
          // Since the omnibar is loaded outside Angular, navigating needs to be explicitly
          // run inside the Angular zone in order for navigation to work properly.
          this.zone.run(() => {
            this.router.navigateByUrl(routePath);
          });
        }

        return false;
      }

      return true;
    };
  }

  private setOmnibarArgsOverrides(omnibarConfig: any, args?: SkyAppOmnibarReadyArgs): void {
    if (args) {
      // Eventually this could be expanded to allow any valid config property to be overridden,
      // but for now keep it scoped to the two parameters we know consumers will want to override.
      if (args.hasOwnProperty('envId')) {
        omnibarConfig.envId = args.envId;
      }

      if (args.hasOwnProperty('svcId')) {
        omnibarConfig.svcId = args.svcId;
      }
    }
  }

  private initShellComponents(): void {
    const omnibarConfig = this.startupSvc.config.omnibar;
    const helpConfig = this.startupSvc.config.help;

    const loadOmnibar = (args?: SkyAppOmnibarReadyArgs) => {
      this.setParamsFromQS(omnibarConfig);
      this.setNav(omnibarConfig);
      this.setOnSearch(omnibarConfig);

      if (helpConfig) {
        omnibarConfig.enableHelp = true;
      }

      omnibarConfig.allowAnonymous = !this.startupSvc.config.auth;

      this.setOmnibarArgsOverrides(omnibarConfig, args);

      const initialThemeSettings = this.getInitialThemeSettings();

      if (initialThemeSettings.theme !== SkyTheme.presets.default) {
        omnibarConfig.theme = {
          mode: initialThemeSettings.mode.name,
          name: initialThemeSettings.theme.name
        };
      }

      // The omnibar uses setInterval() to poll for user activity, and setInterval()
      // triggers change detection on each interval.  Loading the omnibar outside
      // Angular will keep change detection from being triggered during each interval.
      this.zone.runOutsideAngular(() => {
        BBAuthClient.BBOmnibar.load(omnibarConfig).then(() => {
          /* istanbul ignore else */
          if (this.themeSvc) {
            this.themeSvc.settingsChange
              .pipe(
                takeUntil(this.ngUnsubscribe)
              )
              .subscribe((settings) => {
                const currentSettings = settings.currentSettings;

                BBAuthClient.BBOmnibar.update({
                  theme: {
                    mode: currentSettings.mode.name,
                    name: currentSettings.theme.name
                  }
                });
              });
          }
        });

        omnibarLoaded = true;
      });
    };

    // if (this.config.runtime.command === 'e2e') {
    //   this.windowRef.nativeWindow.addEventListener('message', (event: MessageEvent) => {
    //     if (event.data.messageType === 'sky-navigate-e2e') {
    //       this.router.navigate(event.data.url);
    //     }
    //   });
    // }

    if (this.runtimeParams.params.get('addin') !== '1') {
      if (omnibarConfig) {
        if (this.omnibarProvider) {
          this.omnibarProvider.ready().then(loadOmnibar);
        } else {
          loadOmnibar();
        }
      }

      if (helpConfig && this.helpInitService) {
        this.helpInitService.load(helpConfig);
      }
    }
  }

  private getInitialThemeSettings(): SkyThemeSettings {
    return new SkyThemeSettings(
      SkyTheme.presets[this.getInitialThemeName()],
      SkyThemeMode.presets.light
    );
  }

  private getInitialThemeName(): 'default' | 'modern' {
    const themingConfig = this.startupSvc.config.theming;

    if (themingConfig) {
      const svcId = this.runtimeParams.params.get('svcid');

      if (svcId) {
        const svcIdMap = SKYUX_HOST?.theming?.serviceIdMap;

        if (svcIdMap) {
          const mappedTheme = svcIdMap[svcId];

          if (mappedTheme && themingConfig.supportedThemes.indexOf(mappedTheme) >= 0) {
            return mappedTheme;
          }
        }
      }

      return themingConfig.theme;
    }

    return 'default';
  }
}