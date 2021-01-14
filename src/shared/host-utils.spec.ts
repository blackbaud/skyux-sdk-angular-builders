import mock from 'mock-require';

import {
  SkyuxHostUrlConfig
} from './host-url-config';

describe('host utils', () => {

  let hostUrl: string;
  let pathName: string;
  let defaultHostConfig: SkyuxHostUrlConfig;

  beforeEach(() => {
    hostUrl = 'https://app.blackbaud.com/';
    pathName = 'my-project';
    defaultHostConfig = {
      localUrl: 'https://localhost:4200/'
    };
  });

  afterEach(() => {
    mock.stopAll();
  });

  function decode(url: string): object {
    return JSON.parse(Buffer.from(decodeURIComponent(url.split('_cfg=')[1]), 'base64').toString());
  }

  it('should open the SKY UX Host URL with Host config', () => {
    const { createHostUrl } = mock.reRequire('./host-utils');

    const actualUrl = createHostUrl(hostUrl, pathName, defaultHostConfig);

    expect(actualUrl).toEqual(
      'https://app.blackbaud.com/my-project/?local=true&_cfg=eyJsb2NhbFVybCI6Imh0dHBzOi8vbG9jYWxob3N0OjQyMDAvIn0%3D'
    );

    expect(decode(actualUrl)).toEqual({
      localUrl: 'https://localhost:4200/'
    });
  });

  it('should send scripts to SKY UX Host', () => {
    const { createHostUrl } = mock.reRequire('./host-utils');

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
      ]
    });
  });

  it('should handle empty scripts', () => {
    const { createHostUrl } = mock.reRequire('./host-utils');

    defaultHostConfig.scripts = [];

    const actualUrl = createHostUrl(hostUrl, pathName, defaultHostConfig);

    expect(decode(actualUrl)).toEqual({
      localUrl: 'https://localhost:4200/',
      scripts: []
    });
  });

  it('should return the default Host URL', () => {
    const { getHostUrlFromOptions } = mock.reRequire('./host-utils');
    const url = getHostUrlFromOptions();
    expect(url).toEqual('https://app.blackbaud.com/');
  });

});
