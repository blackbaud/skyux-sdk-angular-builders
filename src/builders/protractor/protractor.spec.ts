import * as angularArchitect from '@angular-devkit/architect';

import * as buildAngular from '@angular-devkit/build-angular';

import mock from 'mock-require';

import path from 'path';

import {
  SkyuxConfig
} from '../../shared/skyux-config';

import {
  getProtractorEnvironmentConfig
} from './protractor-environment-utils';

import {
  SkyuxProtractorBuilderOptions
} from './protractor-options';

describe('protractor builder', () => {

  let createBuilderSpy: jasmine.Spy;
  let executeProtractorBuilder: jasmine.Spy;
  let options: SkyuxProtractorBuilderOptions;
  let mockSkyuxConfig: SkyuxConfig;

  beforeEach(() => {

    options = {
      protractorConfig: 'protractor.conf.js'
    };

    mockSkyuxConfig = {
      host: {
        url: 'https://foo.blackbaud.com/'
      }
    };

    createBuilderSpy = jasmine.createSpy('createBuilder').and
      .callFake((cb: any) => cb(options, {
        target: {
          project: 'foo'
        }
      }));

    executeProtractorBuilder = jasmine.createSpy('executeProtractorBuilder').and
      .callFake((_options: any, _context: any, _transforms: any) => {
        return Promise.resolve({
          success: true
        });
      });

    spyOnProperty(angularArchitect, 'createBuilder', 'get').and
      .returnValue(createBuilderSpy);

    spyOnProperty(buildAngular, 'executeProtractorBuilder', 'get').and
      .returnValue(executeProtractorBuilder);

    mock('../../shared/skyux-config-utils', {
      getSkyuxConfig() {
        return mockSkyuxConfig;
      }
    });

  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should overwrite Angular Protractor config with defaults', async () => {
    await (mock.reRequire('./protractor'));

    expect(options).toEqual({
      protractorConfig: path.resolve(__dirname, 'protractor.default.conf.js'),
      skyuxHeadless: false
    });
  });

  it('should save options as an environment variable', async () => {
    options.skyuxHeadless = true;
    await (mock.reRequire('./protractor'));
    const config = getProtractorEnvironmentConfig();
    expect(config?.builderOptions?.skyuxHeadless).toBeTrue();
    expect(config?.skyuxHostUrl).toBe(mockSkyuxConfig.host.url);
  });

});
