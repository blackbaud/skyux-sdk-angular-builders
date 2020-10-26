import mock from 'mock-require';

import {
  SkyuxApplicationAssetHelper
} from '../../app-asset-helper';

describe('Asset URLs loader', () => {

  let queueSpy: jasmine.Spy;
  let mockContext: any;

  beforeEach(() => {
    queueSpy = spyOn(SkyuxApplicationAssetHelper, 'queue').and.callThrough();
    mockContext = {
      query: {
        assetBaseUrl: 'https://foobar.com/'
      }
    };
  });

  afterEach(() => {
    mock.stopAll();
    SkyuxApplicationAssetHelper.flush();
  });

  it('should add asset paths from HTML to the asset helper queue', () => {
    const loader = mock.reRequire('./asset-urls-loader').default;
    const content = `
    @Component({
      selector: 'foo',
      template: '<img src="assets/foo.jpg">'
    })
    export class FooComponent { }
    `;

    loader.apply(mockContext, [content]);

    expect(queueSpy).toHaveBeenCalledWith({
      filePath: 'assets/foo.jpg',
      url: 'https://foobar.com/assets/foo.jpg'
    });
  });

  it('should process duplicate files only once', () => {
    const loader = mock.reRequire('./asset-urls-loader').default;
    const content = `
    @Component({
      selector: 'foo',
      template: '<img src="assets/foo.jpg"><img src="assets/foo.jpg">'
    })
    export class FooComponent { }
    `;

    loader.apply(mockContext, [content]);

    expect(queueSpy).toHaveBeenCalledTimes(1);
  });

  it('should ignore non-component files', () => {
    const loader = mock.reRequire('./asset-urls-loader').default;
    const content = `
    export class FooClass { }
    `;

    loader.apply(mockContext, [content]);

    expect(queueSpy).not.toHaveBeenCalled();
  });

  it('should ignore components without inline templates', () => {
    const loader = mock.reRequire('./asset-urls-loader').default;
    const content = `
    @Component({
      selector: 'foo',
      templateUrl: 'foo.component.html'
    })
    export class FooComponent { }
    `;

    loader.apply(mockContext, [content]);

    expect(queueSpy).not.toHaveBeenCalled();
  });

  it('should ignore templates that do not include assets', () => {
    const loader = mock.reRequire('./asset-urls-loader').default;
    const content = `
    @Component({
      selector: 'foo',
      template: 'Foo content here.'
    })
    export class FooComponent { }
    `;

    loader.apply(mockContext, [content]);

    expect(queueSpy).not.toHaveBeenCalled();
  });

});
