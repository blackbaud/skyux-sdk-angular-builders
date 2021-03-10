export interface SkyuxConfigExternals {
  css: {
    before: {
      url: string;
      integrity: string;
    }[];
    after: {
      url: string;
      integrity: string;
    }[];
  },
  js: {
    before: {
      url: string;
      integrity: string;
      head: boolean;
    }[];
    after: {
      url: string;
      integrity: string;
      head: boolean;
    }[];
  }
};
