import portfinder from 'portfinder';

import { SkyuxServer } from './server';
import { SkyuxServerConfig } from './server-config';

export async function getAvailablePort(config?: {
  preferredPort?: number;
}): Promise<number> {
  return portfinder.getPortPromise({
    port: config?.preferredPort
  });
}

export function createServer(config: SkyuxServerConfig): SkyuxServer {
  return new SkyuxServer(config);
}
