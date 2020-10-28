interface Asset {
  /**
   * The asset's original file path.
   */
  filePath: string;

  /**
   * The asset's URL, which will replace the original file path.
   */
  url: string;
}

/**
 * A singleton that tracks all assets found in an Angular application's HTML templates.
 */
export abstract class SkyuxAppAssetsState {

  private static assets: {
    [filePath: string]: {
      url: string;
    }
  } = { };

  public static queue(asset: Asset): void {
    this.assets[asset.filePath] = {
      url: asset.url
    };
  }

  public static replaceFilePaths(content: string): string {
    for (const [filePath, replacement] of Object.entries(SkyuxAppAssetsState.assets)) {
      content = content.replace(
        new RegExp(filePath, 'gi'),
        replacement.url
      );
    }

    return content;
  }

  public static flush(): void {
    SkyuxAppAssetsState.assets = {};
  }

}
