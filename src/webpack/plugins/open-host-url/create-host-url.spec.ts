import mock from 'mock-require';

import {
  SkyuxCreateHostUrlConfig
} from './create-host-url-config';

describe('create host url', () => {

  let hostUrl: string;
  let pathName: string;
  let defaultHostConfig: SkyuxCreateHostUrlConfig;

  beforeEach(() => {
    hostUrl = 'https://host.nxt.blackbaud.com/';
    pathName = 'my-project';
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

  function decode(url: string): object {
    return JSON.parse(Buffer.from(decodeURIComponent(url.split('_cfg=')[1]), 'base64').toString());
  }

  it('should open the SKY UX Host URL with Host config', () => {
    const { createHostUrl } = mock.reRequire('./create-host-url');

    const actualUrl = createHostUrl(hostUrl, pathName, defaultHostConfig);

    expect(actualUrl).toEqual(
      'https://host.nxt.blackbaud.com/my-project/?local=true&_cfg=eyJsb2NhbFVybCI6Imh0dHBzOi8vbG9jYWxob3N0OjQyMDAvIiwiaG9zdCI6eyJ1cmwiOiJodHRwczovL2FwcC5ibGFja2JhdWQuY29tLyJ9fQ%3D%3D'
    );

    expect(decode(actualUrl)).toEqual({
      localUrl: 'https://localhost:4200/',
      host: {
        url: 'https://host.nxt.blackbaud.com/'
      }
    });
  });

  it('should send scripts to SKY UX Host', () => {
    const { createHostUrl } = mock.reRequire('./create-host-url');

    defaultHostConfig.scripts = [
      {
        name: 'main.ts'
      }
    ];

    const actualUrl = createHostUrl(hostUrl, pathName, defaultHostConfig);

    expect(decode(actualUrl)).toEqual({
      localUrl: 'https://localhost:4200/',
      scripts: [
        { name: 'main.ts' }
      ],
      host: {
        url: 'https://host.nxt.blackbaud.com/'
      }
    });
  });

  it('should handle empty scripts', () => {
    const { createHostUrl } = mock.reRequire('./create-host-url');

    defaultHostConfig.scripts = [];

    const actualUrl = createHostUrl(hostUrl, pathName, defaultHostConfig);

    expect(decode(actualUrl)).toEqual({
      localUrl: 'https://localhost:4200/',
      scripts: [],
      host: {
        url: 'https://host.nxt.blackbaud.com/'
      }
    });
  });

});
