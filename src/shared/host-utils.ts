import { BuilderContext } from '@angular-devkit/architect';

import open from 'open';

import { SkyuxCreateHostUrlConfig } from './create-host-url-config';
import { ensureBaseHref, ensureTrailingSlash } from './url-utils';

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

  baseUrl = ensureBaseHref(ensureTrailingSlash(baseUrl), baseHref);

  return `${baseUrl}?local=true&_cfg=${configEncoded}`;
}

export function openHostUrl(url: string): void {
  console.log(
    `\n\n==================\n SKY UX Host URL:\n==================\n\n${url}\n\n`
  );

  open(url);
}

export function getBaseHref(context: BuilderContext): string {
  return `/${context.target!.project!}/`;
}
