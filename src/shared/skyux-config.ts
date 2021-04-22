// TODO: Add/remove the properties we'll need from @skyux/config.
// export interface SkyuxConfig {
//   app: {
//     base: string;
//     title: string;
//     port: string;
//     externals: {};
//     styles: string[];
//     theming: {
//       theme: string;
//       supportedThemes: string[];
//     };
//   };
//   appSettings: {};
//   auth: boolean;
//   codeCoverageThreshold: 'none'|'standard'|'strict';
//   compileMode: 'aot'|'jit';
//   cssPath: string;
//   enableIvy: boolean;
//   help: {};
//   host: {
//     bbCheckout: {
//       version: '2'
//     };
//     frameOptions: {};
//     url: string;
//   };
//   importPath: string;
//   dependenciesForTranspilation: string[];
//   mode: 'easy'|'advanced';
//   moduleAliases: {};
//   name: string;
//   omnibar: {};
//   pacts: {}[];
//   params: {};
//   pipelineSettings: {};
//   plugins: string[];
//   redirects: {};
//   routes: {};
//   useHashRouting: boolean;
//   skyuxModules: string[];
//   librarySettings: {
//     whitelistedNonPeerDependencies: string[];
//   };
//   testSettings: {
//     e2e: {},
//     unit: {}
//   }
// }

// export interface RuntimeConfig {
//   app: RuntimeConfigApp;
//   command?: string;  // Dynamically added in "higher up" webpacks
//   componentsPattern: string;
//   componentsIgnorePattern: string;
//   handle404?: boolean;  // Dynamically added in sky-pages-module-generator.js
//   includeRouteModule: boolean;
//   pactConfig?: SkyuxPactConfig;
//   params: SkyAppRuntimeConfigParams;
//   routes?: Object[]; // Dynamically added in sky-pages-module-generator.js
//   routesPattern: string;
//   runtimeAlias: string;
//   spaPathAlias: string;
//   skyPagesOutAlias: string;
//   skyuxPathAlias: string;
//   srcPath: string;
//   useTemplateUrl: boolean;
// }

export interface RuntimeConfigApp {
  base: string;
  inject: boolean;
  name?: string;
  template: string;
}

export interface RuntimeConfig {
  app: RuntimeConfigApp;
  command?: string;
  // This should always be set at runtime, but for generating the config to pass to the Webpack loader, it is optional.
  params?: {};
}

/**
 * Dynamically injects CSS and JavaScript files into SKY UX Host.
 * You should have a specific use-case for an externals and they must
 * be white-listed by the SKY UX team.
 */
export interface SkyuxConfigAppExternals {
  css?: {
    before?: {
      url: string;
      integrity?: string;
    }[];
    after?: {
      url: string;
      integrity?: string;
    }[];
  };
  js?: {
    before?: {
      url: string;
      integrity?: string;
      head?: boolean;
    }[];
    after?: {
      url: string;
      integrity?: string;
      head?: boolean;
    }[];
  };
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

/**
 * Options specific to the host platform.
 */
export interface SkyuxConfigHost {
  bbCheckout?: SkyuxConfigHostBBCheckout;

  frameOptions?:
    | SkyuxConfigHostFrameOptionsNone
    | SkyuxConfigHostFrameOptionsOthers;

  url: string;
}

export interface SkyuxConfig {
  app?: {
    externals?: SkyuxConfigAppExternals;
    theming?: {
      theme: string;
      supportedThemes: string[];
    };
  };

  appSettings?: {};

  auth?: boolean;

  codeCoverageThreshold?: 'none' | 'standard' | 'strict';

  help?: {};

  host: SkyuxConfigHost;

  omnibar?: {};
}

export interface SkyAppConfig {
  runtime: RuntimeConfig;
  skyux: SkyuxConfig;
}
