export interface SkyuxAppAssets {

  [fileName: string]: {

    lookup: string;

    hashedFileName: string;

    absolutePath: string;

    hashedAbsoluteUrl: string;

    hashedRelativeUrl: string;

    absoluteUrl: string;

    relativeUrl: string;

  };

}
