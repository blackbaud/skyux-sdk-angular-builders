import { workspaces } from '@angular-devkit/core';

const skyuxPolyfillsCommentStart = `/***************************************************************************************************
 * SKY UX POLYFILLS - DO NOT MODIFY THIS SECTION
 */`;

const skyuxPolyfillsCommentEnd = `/*
 * END SKY UX POLYFILLS
 **************************************************************************************************/`;

const skyuxPolyfillsContent = `${skyuxPolyfillsCommentStart}

// Fix for crossvent \`global is not defined\` error. The crossvent library is used by Dragula,
// which in turn is used by multiple SKY UX components.
// https://github.com/bevacqua/dragula/issues/602
(window as any).global = window;

${skyuxPolyfillsCommentEnd}
`;

export async function modifyPolyfills(
  host: workspaces.WorkspaceHost
): Promise<void> {
  const polyfillsPath = 'src/polyfills.ts';

  let polyfillsContent = await host.readFile(polyfillsPath);

  const polyfillsContentStart = polyfillsContent
    .split(skyuxPolyfillsCommentStart)[0]
    .trim();

  const existingPolyfillsEnd = polyfillsContent
    .split(skyuxPolyfillsCommentEnd)[1]
    ?.trim();

  polyfillsContent = `${polyfillsContentStart}

${skyuxPolyfillsContent}`;

  if (existingPolyfillsEnd) {
    polyfillsContent = `${polyfillsContent}
${existingPolyfillsEnd}
`;
  }

  await host.writeFile(polyfillsPath, polyfillsContent);
}
