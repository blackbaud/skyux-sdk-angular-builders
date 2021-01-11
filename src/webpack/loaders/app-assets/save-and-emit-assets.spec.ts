import mock from 'mock-require';

import {
  SkyuxAppAssetsState
} from '../../app-assets-state';

describe('Save and emit assets', () => {

  let emitFileSpy: jasmine.Spy;
  let queueSpy: jasmine.Spy;
  let mockConfig: any;
  let mockContext: any;
  let hashCounter = 0;

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

    hashCounter = 0;

    mock('hasha', {
      fromFileSync: () => `MOCK_HASH_${hashCounter++}`
    });
  });

  afterEach(() => {
    mock.stopAll();
    SkyuxAppAssetsState.flush();
  });

  it('should save the asset and emit the new file name', () => {
    const content = `["src", "assets/foo.doc"],["src", "assets/foo.png"],["src", "assets/foo.docx"]`;

    const { saveAndEmitAssets } = mock.reRequire('./save-and-emit-assets');

    saveAndEmitAssets.call(mockContext, content, mockConfig);

    expect(emitFileSpy).toHaveBeenCalledWith('assets/foo.MOCK_HASH_0.doc', '', undefined);
    expect(emitFileSpy).toHaveBeenCalledWith('assets/foo.MOCK_HASH_1.png', '', undefined);
    expect(emitFileSpy).toHaveBeenCalledWith('assets/foo.MOCK_HASH_2.docx', '', undefined);

    expect(queueSpy).toHaveBeenCalledWith({
      filePath: 'assets/foo.doc',
      url: 'https://foobar.com/assets/foo.MOCK_HASH_0.doc'
    });

    expect(queueSpy).toHaveBeenCalledWith({
      filePath: 'assets/foo.png',
      url: 'https://foobar.com/assets/foo.MOCK_HASH_1.png'
    });

    expect(queueSpy).toHaveBeenCalledWith({
      filePath: 'assets/foo.docx',
      url: 'https://foobar.com/assets/foo.MOCK_HASH_2.docx'
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
