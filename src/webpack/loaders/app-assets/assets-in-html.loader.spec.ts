import mock from 'mock-require';

describe('Assets in HTML loader', () => {

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

  it('should emit assets for HTML files', () => {
    const loader = mock.reRequire('./assets-in-html.loader').default;
    const content = `
    <img src="assets/foo.jpg">
    `;

    loader.apply(mockContext, [content]);

    expect(saveAndEmitAssetsSpy).toHaveBeenCalled();
  });

});
