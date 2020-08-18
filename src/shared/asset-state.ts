export interface Asset {
  filePath: string;
  url: string
}

export namespace AssetState {
  const assets: Asset[] = [];
  let baseUrl = '';
  
  export function setBaseUrl(url: string) {
    if (url) {
      baseUrl = url;
    }
  }

  export function getBaseUrl(): string {
    return baseUrl;
  }

  export function queue(asset: Asset) {
    assets.push(asset)
  }

  export function run(content: string): string {
    assets.forEach(asset => content= content.replace(new RegExp(asset.filePath, 'gi'), asset.url));
    return content;
  }
}