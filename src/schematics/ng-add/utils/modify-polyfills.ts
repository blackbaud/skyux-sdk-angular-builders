import { workspaces } from '@angular-devkit/core';

const skyuxPolyfillsCommentStart = `/***************************************************************************************************
 * SKY UX POLYFILLS - DO NOT MODIFY THIS SECTION
 */`;

const skyxuPolyfillsCommentEnd = `/*
 * END SKY UX POLYFILLS
 **************************************************************************************************/`;

const skyuxPolyfillsContent = `${skyuxPolyfillsCommentStart}

// Fix for crossvent \`global is not defined\` error. The crossvent library is used by Dragula,
// which in turn is used by multiple SKY UX components.
// https://github.com/bevacqua/dragula/issues/602
(window as any).global = window;

${skyxuPolyfillsCommentEnd}
`;

export async function modifyPolyfills(
  host: workspaces.WorkspaceHost
): Promise<void> {
  const templatePath = 'src/polyfills.ts';

  let polyfillsTs = await host.readFile(templatePath);

  const existingPolyfillsStart = polyfillsTs
    .split(skyuxPolyfillsCommentStart)[0]
    .trim();

  const existingPolyfillsEnd = polyfillsTs
    .split(skyxuPolyfillsCommentEnd)[1]
    ?.trim();

  polyfillsTs = `${existingPolyfillsStart}

${skyuxPolyfillsContent}`;

  if (existingPolyfillsEnd) {
    polyfillsTs = `${polyfillsTs}
${existingPolyfillsEnd}
`;
  }

  await host.writeFile(templatePath, polyfillsTs);
}
