export interface SkyuxAppAssets {

  /**
   * The relative URL to the file found in the source code.
   * e.g., `src="assets/foo.jpg"`
   */
  [relativeUrl: string]: {

    /**
     * The absolute system path to the source file. This will be used to read the file's contents.
     */
    absolutePath: string;

    /**
     * The hashed URL to the file. This will replace the original file URL in the bundled source code.
     */
    hashedUrl: string;

    /**
     * The hashed name of the file to emit with Webpack.
     */
    hashedFileName: string;

  };

}
