export interface SkyuxAppAssets {

  /**
   * The relative URL is the original path to the file in the source code.
   */
  [relativeUrl: string]: {

    /**
     * The absolute path to the original source file. This will be used to read the file's contents.
     */
    absolutePath: string;

    /**
     * The hashed absolute URL to the file. This will replace the original file URL in the bundle source code.
     */
    hashedAbsoluteUrl: string;

    /**
     * The hashed name of the file to emit with Webpack.
     */
    hashedFileName: string;

  };

}
