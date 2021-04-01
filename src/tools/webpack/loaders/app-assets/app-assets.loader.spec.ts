import mock from 'mock-require';

describe('app assets loader', () => {
  afterEach(() => {
    mock.stopAll();
  });

  it('should replace app-assets-map.json contents', () => {
    const loader = mock.reRequire('./app-assets.loader').default;
    const result = loader.apply({
      query: {
        assetsMapStringified: '{"foo.jpg": "images/foo.jpg"}'
      }
    });

    expect(result).toEqual('{"foo.jpg": "images/foo.jpg"}');
  });
});
