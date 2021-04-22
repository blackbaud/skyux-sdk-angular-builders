import mock from 'mock-require';

describe('port finder', () => {
  let mockPort: number;
  let getPortPromiseSpy: jasmine.Spy;

  beforeEach(() => {
    mockPort = 4200;

    getPortPromiseSpy = jasmine
      .createSpy('getPortPromise')
      .and.returnValue(Promise.resolve(mockPort));

    mock('portfinder', {
      getPortPromise: getPortPromiseSpy
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should call portfinder', async () => {
    const portFinder = mock.reRequire('./port-finder');
    const port = await portFinder.getAvailablePort();
    expect(port).toEqual(mockPort);
  });

  it('should call portfinder with a preferred port', async () => {
    const preferredPort = 1111;
    const portFinder = mock.reRequire('./port-finder');
    await portFinder.getAvailablePort(preferredPort);
    expect(getPortPromiseSpy).toHaveBeenCalledWith({
      port: preferredPort
    });
  });
});
