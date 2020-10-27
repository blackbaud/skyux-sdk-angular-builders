import {
  AngularCompilerPlugin
} from '@ngtools/webpack';
import mock from 'mock-require';
import webpack from 'webpack';
import { SkyuxAppAssetsPlugin } from './plugins/app-assets/app-assets.plugin';

describe('App assets utils', () => {

  let webpackConfig: webpack.Configuration;

  beforeEach(() => {
    webpackConfig = {};
  });

  afterEach(() => {
    mock.stopAll();
  });

  function loaderExists(name: string): boolean | undefined {
    return webpackConfig?.module?.rules?.some((rule: any) => {
      return rule.use.some((r: any) => r.loader?.indexOf(name) > -1);
    });
  }

  it('should apply loaders and plugins to webpack config', () => {
    const { applyAppAssetsConfig } = mock.reRequire('./app-assets-utils');

    applyAppAssetsConfig(webpackConfig, {
      deployUrl: ''
    });

    const plugin = webpackConfig.plugins?.find(p => p instanceof SkyuxAppAssetsPlugin);
    expect(plugin).toBeDefined();

    const hasTypeScriptLoader = loaderExists('assets-in-typescript.loader');
    const hasHtmlLoader = loaderExists('assets-in-html.loader');

    expect(hasTypeScriptLoader).toBe(true, 'Expected webpack config to include TypeScript loader.');
    expect(hasHtmlLoader).toBe(true, 'Expected webpack config to include HTML loader.');
  });

  it('should provide HTML loaders access to component templates', () => {
    webpackConfig.plugins = [
      new AngularCompilerPlugin({ tsConfigPath: '' } as any)
    ];

    const { applyAppAssetsConfig } = mock.reRequire('./app-assets-utils');

    applyAppAssetsConfig(webpackConfig, {
      deployUrl: ''
    });

    const plugin: any = webpackConfig.plugins?.find(p => p instanceof AngularCompilerPlugin);
    expect(plugin.options.directTemplateLoading).toBe(false, 'Expected direct template loading to be disabled.');
  });

});
