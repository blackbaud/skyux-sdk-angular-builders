// TODO: Add/remove the properties we'll need from @skyux/config.
// export interface SkyuxConfig {
//   app: {
//     base: string;
//     title: string;
//     port: string;
//     externals: {};
//     styles: string[];
//     themeing: {
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
  },
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
  }
}

/**
 * Options specific to the host platform.
 */
export interface SkyuxConfigHost {
  url: string;
}

export interface SkyuxConfig {
  app?: {
    externals?: SkyuxConfigAppExternals;
  };

  codeCoverageThreshold?: 'none' | 'standard' | 'strict';

  host: SkyuxConfigHost;
}