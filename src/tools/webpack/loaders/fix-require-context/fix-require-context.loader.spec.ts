import mock from 'mock-require';

describe('fix require context loader', () => {
  beforeEach(() => {});

  afterEach(() => {
    mock.stopAll();
  });

  it('should replace `commonjsRequire.context` with `require.context`', () => {
    const loader = mock.reRequire('./fix-require-context.loader').default;

    const result = loader(
      Buffer.from(
        `const FOO = commonjsRequire.context(ROOT_DIR + '../' + somePath);`
      )
    );

    expect(result).toEqual(
      `const FOO = require.context(ROOT_DIR + '../' + somePath);`
    );
  });
});
