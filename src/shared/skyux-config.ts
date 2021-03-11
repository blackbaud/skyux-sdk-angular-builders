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

/* tslint:disable-next-line*/
export interface SkyuxConfigHost {

  url: string;

}

export interface SkyuxConfig {
  app?: {
    externals?: SkyuxConfigAppExternals;
  };

  codeCoverageThreshold?: 'none'|'standard'|'strict';

  host: SkyuxConfigHost;
}
