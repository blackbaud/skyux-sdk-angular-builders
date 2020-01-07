import {
  SkyAppExternalAssets
} from '../external-assets';

export interface SkyHostGetUrlArgs {
  localAssets: {
    scripts: {
      name: string;
    }[];
  };
  localUrl: string;
  spaName: string;
  baseUrl?: string;
  externalAssets?: SkyAppExternalAssets;
}

interface SkyHostConfig {
  localUrl: string;
  scripts: {
    name: string;
  }[];
  externals?: SkyAppExternalAssets;
}

function encodeConfig(config: SkyHostConfig): string {
  return Buffer.from(JSON.stringify(config)).toString('base64');
}

export class SkyHost {

  public static getUrl(args: SkyHostGetUrlArgs): string {
    if (
      args.baseUrl &&
      args.baseUrl.charAt(args.baseUrl.length - 1) !== '/'
    ) {
      throw new Error('The host `baseUrl` must end with a forward slash.');
    }

    const config: SkyHostConfig = {
      localUrl: args.localUrl,
      scripts: args.localAssets.scripts
    };

    if (args.externalAssets) {
      config.externals = args.externalAssets;
    }

    const encodedConfig = encodeConfig(config);
    const urlBase = args.baseUrl || SkyHost.baseUrl;

    return `${urlBase}${args.spaName}/?local=true&_cfg=${encodedConfig}`;
  }

  private static readonly baseUrl: string = 'https://host.nxt.blackbaud.com/';

}
