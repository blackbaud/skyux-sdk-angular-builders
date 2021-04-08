export function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

/**
 * Ensures the URL ends with the supplied base href.
 */
export function ensureBaseHref(url: string, baseHref: string): string {
  if (url.endsWith(baseHref)) {
    return url;
  }

  return url.substring(0, url.length - 1) + baseHref;
}
