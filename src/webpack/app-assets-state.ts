interface Asset {
  filePath: string;
  url: string;
}

export abstract class SkyuxAppAssetsState {

  private static assets: {
    [filePath: string]: {
      url: string;
    }
  } = {};

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

}
