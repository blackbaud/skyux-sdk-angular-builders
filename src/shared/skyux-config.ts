export interface SkyuxConfig {
  app?: {
    theming?: {
      theme: string;
      supportedThemes: string[];
    };
  };

  codeCoverageThreshold?: 'none' | 'standard' | 'strict'; // <-- Move to angular.json?
  // librarySettings?: {
  //   whitelistedNonPeerDependencies: string[];
  // };
  // pacts: {}[];
  // pipelineSettings: {};
  // testSettings?: {
  //   e2e?: {};
  //   unit?: {};
  // };
  // dependenciesForTranspilation: string[];
}
