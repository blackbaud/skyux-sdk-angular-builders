import {
  SkyuxHostUrlConfig
} from './host-url-config';

/**
 * Creates the SKY UX Host URL.
 * @param baseUrl The base SKY UX Host URL, including the protocol.
 * @param pathName The URL-friendly pathname where the project will be served.
 * @param config Configuration that will be sent to the host server.
 */
 export function createHostUrl(
  baseUrl: string,
  pathName: string,
  config: SkyuxHostUrlConfig
): string {
  // We need to URL-encode the config so that characters such as '+'
  // are properly represented.
  const configEncoded = encodeURIComponent(
    Buffer.from(JSON.stringify(config)).toString('base64')
  );

  console.log('Sending config to Host:', config);

  return `${baseUrl}${pathName}/?local=true&_cfg=${configEncoded}`;
}
