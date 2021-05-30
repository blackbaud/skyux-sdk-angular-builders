import { WorkspaceHost } from '@angular-devkit/core/src/workspace';

export async function modifyKarmaConfig(
  host: WorkspaceHost,
  projectRoot: string
): Promise<void> {
  await host.writeFile(
    `${projectRoot}/karma.conf.js`,
    `// DO NOT MODIFY
// This file is handled by the '@skyux-sdk/angular-builders' library.
module.exports = function (config) {
  config.set({});
};
`
  );
}
