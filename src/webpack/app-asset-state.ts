interface Asset {
  newFilePath: string;
}

export abstract class SkyuxApplicationAssetState {

  private static assets: {[filePath: string]: Asset} = {};

  public static queue(asset: {
    originalFilePath: string;
    newFilePath: string;
  }): void {
    this.assets[asset.originalFilePath] = {
      newFilePath: asset.newFilePath
    };
  }

  public static replaceFilePaths(): void {}

}
