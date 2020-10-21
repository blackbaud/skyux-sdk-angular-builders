import open from 'open';

import {
  SkyuxHostUrlConfig
} from './host-url-config';

import {
  ensureTrailingSlash
} from './url-utils';

export function getHostUrlFromOptions(options?: {
  skyuxHostUrl?: string
}): string {
  return ensureTrailingSlash(options?.skyuxHostUrl || 'https://app.blackbaud.com/');
}

/**
 *
 * @param baseUrl The base Host URL, including the protocol.
 * @param pathName The URL-friendly pathname where the project will be served.
 * @param config Configuration that will be sent to the host server.
 */
export function openHostUrl(
  baseUrl: string,
  pathName: string,
  config: SkyuxHostUrlConfig
): void {
  // We need to URL encode the value so that characters such as '+'
  // are properly represented.
  const configEncoded = encodeURIComponent(
    Buffer.from(JSON.stringify(config)).toString('base64')
  );

  const url = `${baseUrl}${pathName}/?local=true&_cfg=${configEncoded}`;

  console.log(`\nSKY UX Host URL:\n\n${url}`);

  open(url);

}
