import mock from 'mock-require';

describe('Assets in TypeScript loader', () => {

  let saveAndEmitAssetsSpy: jasmine.Spy;
  let mockContext: any;

  beforeEach(() => {
    saveAndEmitAssetsSpy = jasmine.createSpy('saveAndEmitAssets');

    mockContext = {
      query: {
        assetBaseUrl: 'https://foobar.com/'
      }
    };

    mock('./save-and-emit-assets', {
      saveAndEmitAssets: saveAndEmitAssetsSpy
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should emit assets for component files', () => {
    const loader = mock.reRequire('./assets-in-typescript.loader').default;
    const content = `
    @Component({
      selector: 'foo',
      template: '<img src="assets/foo.jpg">'
    })
    export class FooComponent { }
    `;

    loader.apply(mockContext, [content]);

    expect(saveAndEmitAssetsSpy).toHaveBeenCalled();
  });

  it('should ignore non-component files', () => {
    const loader = mock.reRequire('./assets-in-typescript.loader').default;
    const content = `
    export class FooClass { }
    `;

    loader.apply(mockContext, [content]);

    expect(saveAndEmitAssetsSpy).not.toHaveBeenCalled();
  });

  it('should ignore components without inline templates', () => {
    const loader = mock.reRequire('./assets-in-typescript.loader').default;
    const content = `
    @Component({
      selector: 'foo',
      templateUrl: 'foo.component.html'
    })
    export class FooComponent { }
    `;

    loader.apply(mockContext, [content]);

    expect(saveAndEmitAssetsSpy).not.toHaveBeenCalled();
  });

});
