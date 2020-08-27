// TODO: DECIDE iF WE NEED THIS
// I imagine this will move in to a karma config file?
export interface SkyuxConfigA11y {
  rules?: any;
}

export type SkyuxConfigAppSupportedTheme = 'default' | 'modern';

export interface SkyuxConfigAppTheming {
  supportedThemes: SkyuxConfigAppSupportedTheme[];
  theme: SkyuxConfigAppSupportedTheme;
}

export interface SkyuxConfigApp {
  // first-class in Angular
  // base?: string;

  // first-class in Angular, BUT our's is more robust - is it worth it?
  externals?: Object;

  // first-class in Angular
  // port?: string;

  // first-class in Angular
  // styles?: string[];

  // Yeah, I guess so, but I admittedly don't know where it's used
  theming?: SkyuxConfigAppTheming;

  // Just use the title service b/c:
  //  - Host ignores it and always sets "Blackbaud" + uses ng Title Service
  //  - Local index.html file can be altered in place
  // title?: string;
}

export interface SkyuxConfigHostBBCheckout {
  version: '2';
}

export interface SkyuxConfigHostFrameOptionsNone {
  blackbaud?: false;
  none: true;
  self?: false;
  urls?: [];
}

export interface SkyuxConfigHostFrameOptionsOthers {
  blackbaud?: boolean;
  none?: false;
  self?: boolean;
  urls?: string[];
}

export interface SkyuxConfigHost {
  bbCheckout?: SkyuxConfigHostBBCheckout;
  frameOptions?: SkyuxConfigHostFrameOptionsNone | SkyuxConfigHostFrameOptionsOthers;
  url?: string;
}

export type SkyuxConfigParams = {
  [key: string]: boolean | {
    value?: any;
    required?: boolean;
    excludeFromRequests?: boolean;
  }
};

export interface SkyuxConfigE2ETestSettings {
  browserSet?: 'speedy';
}

export interface SkyuxConfigUnitTestSettings {
  browserSet?: 'speedy' | 'quirky' | 'paranoid';
}

export interface SkyuxConfigTestSettings {
  e2e?: SkyuxConfigE2ETestSettings;
  unit?: SkyuxConfigUnitTestSettings;
}

export interface SkyuxConfig {
  a11y?: SkyuxConfigA11y | boolean;
  app?: SkyuxConfigApp;
  codeCoverageThreshold?: 'none' | 'standard' | 'strict';
  // command?: string;
  // compileMode?: string;
  // cssPath?: string;
  // enableIvy?: boolean;
  host?: SkyuxConfigHost;
  // importPath?: string;
  // librarySettings?: SkyuxConfigLibrarySettings;
  // mode?: string;
  // moduleAliases?: {[key: string]: string};
  // name?: string;
  pacts?: any[];
  params?: SkyuxConfigParams;
  pipelineSettings?: any;
  plugins?: string[];
  redirects?: any;
  routes?: {
    public?: any[],
    referenced?: any[]
  };
  testSettings?: SkyuxConfigTestSettings;

  // Use APP_INITIALIZER
  auth?: boolean;

  
  help?: any;
  omnibar?: any;
  // useHashRouting?: boolean;
  // skyuxModules?: string[];
}