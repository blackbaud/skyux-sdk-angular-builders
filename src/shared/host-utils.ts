import open from 'open';

import {
  SkyuxHostConfig
} from './host-config';

import {
  ensureTrailingSlash
} from './url-utils';

export function getHostUrlFromOptions(options?: {
  skyuxHostUrl?: string
}): string {
  return ensureTrailingSlash(options?.skyuxHostUrl || 'https://app.blackbaud.com/');
}

export function openHostUrl(
  hostUrl: string,
  pathName: string,
  config: SkyuxHostConfig
): void {
  // We need to URL encode the value so that characters such as '+'
  // are properly represented.
  const configEncoded = encodeURIComponent(
    Buffer.from(JSON.stringify(config)).toString('base64')
  );

  const url = `${hostUrl}${pathName}/?local=true&_cfg=${configEncoded}`;

  console.log(`\nSKY UX Host URL:\n\n${url}`);

  open(url);

}
