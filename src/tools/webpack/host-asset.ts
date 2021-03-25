import {
  SkyuxHostAssetType
} from './host-asset-type';

export interface SkyuxHostAsset {

  /**
   * The name of the global "fallback" variable to test if the JavaScript file has loaded.
   * @see: https://docs.microsoft.com/en-us/aspnet/core/mvc/views/tag-helpers/built-in/script-tag-helper
   */
  fallback?: string;

  /**
   * The CSS fallback rule to test if the style sheet file has loaded.
   * @see: https://docs.microsoft.com/en-us/aspnet/core/mvc/views/tag-helpers/built-in/link-tag-helper
   */
  fallbackStylesheetClass?: string;
  fallbackStylesheetProperty?: string;
  fallbackStylesheetValue?: string;

  /**
   * Specifies if the chunk is the main chunk for the entry point.
   * @see https://webpack.js.org/concepts/under-the-hood/#chunks
   */
  initial?: boolean;

  /**
   * The name of the file.
   */
  name: string;

  /**
   * The type of asset.
   */
  type: SkyuxHostAssetType;

}
