// TODO: This is the same as the ./asset file?
interface Asset {

  filePath: string;

  url: string

}

export abstract class AssetState {

  private static assets: Asset[] = [];

  public static set baseUrl(value: string) {
    if (value) {
      this._baseUrl = value;
    }
  }

  public static get baseUrl(): string {
    return this._baseUrl || '';
  }

  private static _baseUrl: string;

  public static queue(asset: Asset): void {
    this.assets.push(asset);
    console.log('Queue:', asset);
  }

  public static replaceAssetPaths(content: string): string {
    this.assets.forEach(asset => {
      content = content.replace(
        new RegExp(asset.filePath, 'gi'),
        asset.url
      );
    });

    return content;
  }

}
