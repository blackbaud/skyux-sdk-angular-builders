import mock from 'mock-require';

import {
  SkyuxAppAssetsState
} from '../../app-assets-state';

describe('Save and emit assets', () => {

  let emitFileSpy: jasmine.Spy;
  let queueSpy: jasmine.Spy;
  let mockConfig: any;
  let mockContext: any;

  beforeEach(() => {
    emitFileSpy = jasmine.createSpy('emitFile');
    queueSpy = spyOn(SkyuxAppAssetsState, 'queue').and.callThrough();

    mockContext = {
      emitFile: emitFileSpy,
      fs: {
        readFileSync: () => ''
      }
    };

    mockConfig = {
      assetBaseUrl: 'https://foobar.com/'
    };

    mock('hasha', {
      fromFileSync: () => 'MOCK_HASH'
    });
  });

  afterEach(() => {
    mock.stopAll();
    SkyuxAppAssetsState.flush();
  });

  it('should save the asset and emit the new file name', () => {
    const content = `["assets/foo.png"]`;
    const { saveAndEmitAssets } = mock.reRequire('./save-and-emit-assets');
    saveAndEmitAssets.call(mockContext, content, mockConfig);
    expect(emitFileSpy.calls.mostRecent().args[0]).toBe(
      'assets/foo.MOCK_HASH.png',
      'Expected file name to include a hash.'
    );
    expect(queueSpy).toHaveBeenCalledWith({
      filePath: 'assets/foo.png',
      url: 'https://foobar.com/assets/foo.MOCK_HASH.png'
    });
  });

  it('should process an asset only once', () => {
    const content = `["assets/duplicate.png"],["assets/duplicate.png"],["assets/duplicate.png"]`;
    const { saveAndEmitAssets } = mock.reRequire('./save-and-emit-assets');
    saveAndEmitAssets.call(mockContext, content, mockConfig);
    expect(queueSpy).toHaveBeenCalledTimes(1);
  });

  it('should ignore files without assets', () => {
    const content = `Some content here.`;
    const { saveAndEmitAssets } = mock.reRequire('./save-and-emit-assets');
    saveAndEmitAssets.call(mockContext, content, mockConfig);
    expect(emitFileSpy).not.toHaveBeenCalled();
    expect(queueSpy).not.toHaveBeenCalled();
  });

});
