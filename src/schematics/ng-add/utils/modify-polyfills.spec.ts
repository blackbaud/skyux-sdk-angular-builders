import { workspaces } from '@angular-devkit/core';

import { modifyPolyfills } from './modify-polyfills';

describe('Modify polyfills', () => {
  const skyuxPolyfills = `/***************************************************************************************************
 * SKY UX POLYFILLS - DO NOT MODIFY THIS SECTION
 */

// Fix for crossvent \`global is not defined\` error. The crossvent library is used by Dragula,
// which in turn is used by multiple SKY UX components.
// https://github.com/bevacqua/dragula/issues/602
(window as any).global = window;

/*
 * END SKY UX POLYFILLS
 **************************************************************************************************/`;

  let mockWorkspaceHost: jasmine.SpyObj<workspaces.WorkspaceHost>;
  let testPolyfillsTs: string;

  function validateWriteFile(expectedContent: string): void {
    expect(mockWorkspaceHost.writeFile).toHaveBeenCalledWith(
      'src/polyfills.ts',
      expectedContent
    );
  }

  beforeEach(() => {
    testPolyfillsTs = '';

    mockWorkspaceHost = jasmine.createSpyObj<workspaces.WorkspaceHost>('host', [
      'readFile',
      'writeFile'
    ]);

    mockWorkspaceHost.readFile.and.callFake(() =>
      Promise.resolve(testPolyfillsTs)
    );

    mockWorkspaceHost.writeFile.and.callFake(() => Promise.resolve());
  });

  it('should append polyfills to the end of the file if not already present', async () => {
    testPolyfillsTs = `(window as any).foo = 'bar';
`;

    await modifyPolyfills(mockWorkspaceHost);

    validateWriteFile(
      `(window as any).foo = 'bar';

${skyuxPolyfills}
`
    );
  });

  it('should update existing SKY UX polyfills at the end of a file', async () => {
    // tslint:disable-next-line: no-debugger
    debugger;
    testPolyfillsTs = `(window as any).foo = 'bar';

/***************************************************************************************************
 * SKY UX POLYFILLS - DO NOT MODIFY THIS SECTION
 */

(window as any).oldPolyfill = 'foo';

/*
 * END SKY UX POLYFILLS
 **************************************************************************************************/`;

    await modifyPolyfills(mockWorkspaceHost);

    validateWriteFile(
      `(window as any).foo = 'bar';

${skyuxPolyfills}
`
    );
  });

  it('should update existing SKY UX polyfills in the middle of a file', async () => {
    testPolyfillsTs = `(window as any).foo = 'bar';

/***************************************************************************************************
 * SKY UX POLYFILLS - DO NOT MODIFY THIS SECTION
 */

(window as any).oldPolyfill = 'foo';

/*
 * END SKY UX POLYFILLS
 **************************************************************************************************/

(window as any).bar = 'baz';
`;

    await modifyPolyfills(mockWorkspaceHost);

    validateWriteFile(
      `(window as any).foo = 'bar';

${skyuxPolyfills}

(window as any).bar = 'baz';
`
    );
  });
});
