import { ensureTrailingSlash } from '../../../../shared/url-utils';
import { SkyuxCreateHostUrlConfig } from './create-host-url-config';

/**
 * Creates the SKY UX Host URL.
 * @param baseUrl The base SKY UX Host URL, including the protocol.
 * @param baseHref The URL-friendly base HREF where the project will be served.
 * @param config Configuration that will be sent to the host server.
 */
export function createHostUrl(
  baseUrl: string,
  baseHref: string,
  config: SkyuxCreateHostUrlConfig
): string {
  // We need to URL-encode the config so that characters such as '+'
  // are properly represented.
  const configEncoded = encodeURIComponent(
    Buffer.from(JSON.stringify(config)).toString('base64')
  );

  baseUrl = ensureTrailingSlash(baseUrl);

  return `${baseUrl}${baseHref}/?local=true&_cfg=${configEncoded}`;
}
