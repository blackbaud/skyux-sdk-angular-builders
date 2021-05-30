import { Tree } from '@angular-devkit/schematics';

export function createSkyuxConfigIfNotExists(tree: Tree) {
  if (!tree.exists('skyuxconfig.json')) {
    tree.create(
      'skyuxconfig.json',
      JSON.stringify(
        {
          $schema:
            './node_modules/@skyux-sdk/angular-builders/skyuxconfig-schema.json'
        },
        undefined,
        2
      )
    );
  }
}
