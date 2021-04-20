import portfinder from 'portfinder';

export function getAvailablePort(preferredPort?: number): Promise<number> {
  return portfinder.getPortPromise({
    port: preferredPort
  });
}
