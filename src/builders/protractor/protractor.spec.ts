import * as angularArchitect from '@angular-devkit/architect';
import * as buildAngular from '@angular-devkit/build-angular';

import mock from 'mock-require';
import path from 'path';

import {
  clearProtractorEnvironmentConfig,
  getProtractorEnvironmentConfig
} from '../../shared/protractor-environment-utils';
import { SkyuxProtractorBuilderOptions } from './protractor-options';

describe('protractor builder', () => {
  let createBuilderSpy: jasmine.Spy;
  let executeProtractorBuilder: jasmine.Spy;
  let options: SkyuxProtractorBuilderOptions;

  beforeEach(() => {
    options = {
      protractorConfig: 'protractor.conf.js'
    };

    createBuilderSpy = jasmine
      .createSpy('createBuilder')
      .and.callFake((cb: any) =>
        cb(options, {
          target: {
            project: 'foo'
          }
        })
      );

    executeProtractorBuilder = jasmine
      .createSpy('executeProtractorBuilder')
      .and.callFake((_options: any, _context: any, _transforms: any) => {
        return Promise.resolve({
          success: true
        });
      });

    spyOnProperty(angularArchitect, 'createBuilder', 'get').and.returnValue(
      createBuilderSpy
    );

    spyOnProperty(
      buildAngular,
      'executeProtractorBuilder',
      'get'
    ).and.returnValue(executeProtractorBuilder);
  });

  afterEach(() => {
    mock.stopAll();
    clearProtractorEnvironmentConfig();
  });

  it('should overwrite Angular Protractor config with defaults', async () => {
    await mock.reRequire('./protractor');

    expect(options).toEqual({
      protractorConfig: path.resolve(__dirname, 'protractor.default.conf.js'),
      skyuxHeadless: false
    });
  });

  it('should save builder options as an environment variable', async () => {
    options.skyuxHeadless = true;
    await mock.reRequire('./protractor');
    expect(
      getProtractorEnvironmentConfig()?.builderOptions?.skyuxHeadless
    ).toBeTrue();
  });
});
