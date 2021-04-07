import mock from 'mock-require';

import { SkyuxCreateHostUrlConfig } from './create-host-url-config';
import { SkyuxHostAssetType } from './host-asset-type';
import { SkyuxConfigHost } from './skyux-config';

describe('host utils', () => {
  let hostUrl: string;
  let baseHref: string;
  let defaultHostConfig: SkyuxCreateHostUrlConfig;

  beforeEach(() => {
    hostUrl = 'https://host.nxt.blackbaud.com/';
    baseHref = '/my-project/';
    defaultHostConfig = {
      localUrl: 'https://localhost:4200/',
      host: {
        url: hostUrl
      }
    };
  });

  afterEach(() => {
    mock.stopAll();
  });

  function decode(url: string): SkyuxCreateHostUrlConfig {
    return JSON.parse(
      Buffer.from(
        decodeURIComponent(url.split('_cfg=')[1]),
        'base64'
      ).toString()
    );
  }

  it('should create a SKY UX Host URL with Host config', () => {
    const { createHostUrl } = mock.reRequire('./host-utils');

    const actualUrl = createHostUrl(hostUrl, baseHref, defaultHostConfig);

    expect(actualUrl).toEqual(
      'https://host.nxt.blackbaud.com/my-project/?local=true&_cfg=eyJsb2NhbFVybCI6Imh0dHBzOi8vbG9jYWxob3N0OjQyMDAvIiwiaG9zdCI6eyJ1cmwiOiJodHRwczovL2hvc3Qubnh0LmJsYWNrYmF1ZC5jb20vIn19'
    );

    expect(decode(actualUrl)).toEqual({
      localUrl: 'https://localhost:4200/',
      host: {
        url: 'https://host.nxt.blackbaud.com/'
      }
    });
  });

  it('should send bbCheckout and frameOptions to Host', () => {
    const { createHostUrl } = mock.reRequire('./host-utils');

    const hostConfig: SkyuxConfigHost = {
      url: 'https://foo.blackbaud.com/',
      bbCheckout: {
        version: '2'
      },
      frameOptions: {
        none: true
      }
    };

    defaultHostConfig.host = hostConfig;

    const actualUrl = createHostUrl(hostUrl, baseHref, defaultHostConfig);

    expect(decode(actualUrl).host).toEqual(hostConfig);
  });

  it('should send scripts and style sheets to SKY UX Host', () => {
    const { createHostUrl } = mock.reRequire('./host-utils');

    defaultHostConfig.scripts = [
      {
        name: 'main.js',
        type: SkyuxHostAssetType.Script
      }
    ];

    defaultHostConfig.stylesheets = [
      {
        name: 'styles.css',
        type: SkyuxHostAssetType.Stylesheet
      }
    ];

    const actualUrl = createHostUrl(hostUrl, baseHref, defaultHostConfig);

    expect(decode(actualUrl)).toEqual({
      localUrl: 'https://localhost:4200/',
      scripts: [
        {
          name: 'main.js',
          type: SkyuxHostAssetType.Script
        }
      ],
      stylesheets: [
        {
          name: 'styles.css',
          type: SkyuxHostAssetType.Stylesheet
        }
      ],
      host: {
        url: 'https://host.nxt.blackbaud.com/'
      }
    });
  });

  it('should send `externals` to SKY UX Host', () => {
    const { createHostUrl } = mock.reRequire('./host-utils');

    const externals = {
      js: {
        before: [
          {
            url: 'foo.js'
          }
        ]
      }
    };

    defaultHostConfig.externals = externals;

    const actualUrl = createHostUrl(hostUrl, baseHref, defaultHostConfig);

    expect(decode(actualUrl).externals).toEqual(externals);
  });

  it('should handle empty scripts', () => {
    const { createHostUrl } = mock.reRequire('./host-utils');

    defaultHostConfig.scripts = [];

    const actualUrl = createHostUrl(hostUrl, baseHref, defaultHostConfig);

    expect(decode(actualUrl)).toEqual({
      localUrl: 'https://localhost:4200/',
      scripts: [],
      host: {
        url: 'https://host.nxt.blackbaud.com/'
      }
    });
  });
});
