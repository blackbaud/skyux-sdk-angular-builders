import open from 'open';
import { ensureTrailingSlash } from './url-utils';
import { SkyuxCreateHostUrlConfig } from './create-host-url-config';
import { SkyuxConfigAppExternals, SkyuxConfigHost } from './skyux-config';
import { SkyuxHostAsset } from './host-asset';

/**
 * Creates the SKY UX Host URL.
 * @param baseUrl The base SKY UX Host URL, including the protocol.
 * @param baseHref The URL-friendly base HREF where the project will be served.
 * @param config Configuration that will be sent to the host server.
 */
function createHostUrl(
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

export function openHostUrl(config: {
  baseHref: string;
  externals?: SkyuxConfigAppExternals;
  host: SkyuxConfigHost;
  localUrl: string;
  assets: {
    scripts: SkyuxHostAsset[];
    stylesheets: SkyuxHostAsset[];
  };
}): string {
  const hostUrlConfig: SkyuxCreateHostUrlConfig = {
    host: config.host,
    localUrl: config.localUrl,
    rootElementTagName: 'app-root',
    scripts: config.assets.scripts,
    stylesheets: config.assets.stylesheets
  };

  if (config.externals) {
    hostUrlConfig.externals = config.externals;
  }

  const url = createHostUrl(config.host.url, config.baseHref, hostUrlConfig);

  console.log(
    `\n\n==================\n SKY UX Host URL:\n==================\n\n${url}\n\n`
  );

  open(url);

  return url;
}
