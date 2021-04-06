import portfinder from 'portfinder';

export function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

export async function getAvailablePort(config?: {
  defaultPort?: number;
}): Promise<number> {
  return portfinder.getPortPromise({
    port: config?.defaultPort
  });
}
