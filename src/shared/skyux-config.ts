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
}

export interface SkyuxConfig {
  app?: {
    externals?: SkyuxConfigAppExternals;
  };
}
