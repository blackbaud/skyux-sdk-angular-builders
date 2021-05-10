import { WorkspaceHost } from '@angular-devkit/core/src/workspace';

export async function readJson(host: WorkspaceHost, filePath: string) {
  const contents = await host.readFile(filePath);
  return JSON.parse(contents);
}
