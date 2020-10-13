export interface Asset {

  /**
   * The name of the global "fallback" variable to test if the asset file has loaded.
   * @see: https://docs.microsoft.com/en-us/aspnet/core/mvc/views/tag-helpers/built-in/link-tag-helper
   */
  fallback?: string;

  /**
   * Specifies if the chunk is the main chunk for the entry point.
   * @see https://webpack.js.org/concepts/under-the-hood/#chunks
   */
  initial?: boolean;

  /**
   * The name of the file.
   */
  name: string;

}
