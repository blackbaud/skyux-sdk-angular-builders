import portfinder from 'portfinder';

export function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

export async function getAvailablePort(config?: {
  preferredPort?: number;
}): Promise<number> {
  return portfinder.getPortPromise({
    port: config?.preferredPort
  });
}

/**
 * Ensures the URL ends with the supplied base HREF.
 */
export function ensureBaseHref(url: string, baseHref: string): string {
  if (url.endsWith(baseHref)) {
    return url;
  }

  return url.substring(0, url.length - 1) + baseHref;
}
