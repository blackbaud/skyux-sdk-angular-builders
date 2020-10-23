/**
 * Represents an asset found in an Angular component's HTML template.
 */
interface Asset {
  filePath: string;
  url: string
}

export class SkyuxAssetService {

  private assets: Asset[] = [];

  public queue(asset: Asset): void {
    this.assets.push(asset);
  }

  public replaceAssetPaths(content: string): string {
    this.assets.forEach(asset => {
      content = content.replace(
        new RegExp(asset.filePath, 'gi'),
        asset.url
      );
    });

    return content;
  }
}
