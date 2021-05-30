import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp, createTestLibrary } from '../testing/scaffold';

import * as modifyPolyfillsModule from './utils/modify-polyfills';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');

describe('ng-add.schematic', () => {
  let runner: SchematicTestRunner;

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', COLLECTION_PATH);
  });

  async function runSchematic(
    tree: UnitTestTree,
    options?: { project?: string }
  ): Promise<void> {
    await runner.runSchematicAsync('ng-add', options, tree).toPromise();
  }

  function getAngularJson(app: UnitTestTree): any {
    return JSON.parse(app.readContent('angular.json'));
  }

  function writeAngularJson(app: UnitTestTree, content: any) {
    app.overwrite('angular.json', JSON.stringify(content));
  }

  describe('> Application as default project >', () => {
    let app: UnitTestTree;
    let modifyPolyfillsSpy: jasmine.Spy;

    beforeEach(async () => {
      modifyPolyfillsSpy = spyOn(modifyPolyfillsModule, 'modifyPolyfills');

      const result = await createTestApp(runner, {
        defaultProjectName: 'foobar'
      });
      app = result.appTree;
    });

    it('should run the NodePackageInstallTask', async () => {
      await runSchematic(app, {
        project: 'foobar'
      });

      expect(runner.tasks.some((task) => task.name === 'node-package')).toEqual(
        true,
        'Expected the schematic to setup a package install step.'
      );
    });

    it('should use the default project if none provided', async () => {
      const emptyOptions = {};
      await expectAsync(runSchematic(app, emptyOptions)).not.toBeRejected();
    });

    it("should throw an error if angular.json doesn't exist", async () => {
      app.delete('angular.json');

      await expectAsync(
        runSchematic(app, {
          project: 'invalid-foobar'
        })
      ).toBeRejectedWithError(
        'Unable to locate a workspace file for workspace path.'
      );
    });

    it("should throw an error if specified project doesn't exist", async () => {
      await expectAsync(
        runSchematic(app, {
          project: 'invalid-project'
        })
      ).toBeRejectedWithError(
        'The "invalid-project" project is not defined in angular.json. Provide a valid project name.'
      );
    });

    it("should throw an error if specified project doesn't include an `architect` property", async () => {
      // Create an incorrectly formatted project config.
      const angularJson = getAngularJson(app);
      angularJson.projects['invalid-project'] = {
        projectType: 'application'
      };

      writeAngularJson(app, angularJson);

      await expectAsync(
        runSchematic(app, {
          project: 'invalid-project'
        })
      ).toBeRejectedWithError(
        'Expected node projects/invalid-project/architect in angular.json!'
      );
    });

    it('should overwrite the default serve and test architects', async () => {
      await runSchematic(app, {
        project: 'foobar'
      });

      const angularJson = getAngularJson(app);
      expect(angularJson.projects.foobar.architect.serve.builder).toEqual(
        '@skyux-sdk/angular-builders:dev-server'
      );
      expect(angularJson.projects.foobar.architect.test.builder).toEqual(
        '@skyux-sdk/angular-builders:karma'
      );
    });

    it('should add packages to package.json', async () => {
      await runSchematic(app, {
        project: 'foobar'
      });

      const packageJson = JSON.parse(app.readContent('package.json'));
      expect(packageJson.dependencies).toEqual(
        jasmine.objectContaining({
          '@skyux/theme': '^5.0.0-alpha.0'
        })
      );
      expect(packageJson.devDependencies).toEqual(
        jasmine.objectContaining({
          '@skyux-sdk/testing': '^4.0.0'
        })
      );
    });

    it('should add packages to package.json files without dependency sections', async () => {
      // Create an empty package.json file.
      app.overwrite('package.json', JSON.stringify({}));

      await runSchematic(app, {
        project: 'foobar'
      });

      const packageJson = JSON.parse(app.readContent('package.json'));
      expect(packageJson.dependencies).toBeDefined();
      expect(packageJson.devDependencies).toBeDefined();
    });

    it('should generate an empty skyuxconfig.json file', async () => {
      await runSchematic(app, {
        project: 'foobar'
      });

      const skyuxconfigJson = JSON.parse(app.readContent('skyuxconfig.json'));
      expect(skyuxconfigJson).toEqual({
        $schema:
          './node_modules/@skyux-sdk/angular-builders/skyuxconfig-schema.json'
      });
    });

    it('should not generate skyuxconfig.json file if already exists', async () => {
      app.create('skyuxconfig.json', '{"foo": "Hello, world!"}');

      await runSchematic(app, {
        project: 'foobar'
      });

      const skyuxconfigJson = JSON.parse(app.readContent('skyuxconfig.json'));
      expect(skyuxconfigJson).toEqual({
        foo: 'Hello, world!'
      });
    });

    it('should add theme stylesheets to angular.json', async () => {
      await runSchematic(app, {
        project: 'foobar'
      });

      const angularJson = getAngularJson(app);
      expect(
        angularJson.projects['foobar'].architect.build.options.styles
      ).toEqual(['@skyux/theme/css/sky.css', 'src/styles.css']);
    });

    it('should adjust settings in tsconfig.json', async () => {
      app.overwrite('tsconfig.json', '{ "compilerOptions": {} }');

      await runSchematic(app, {
        project: 'foobar'
      });

      const tsConfig = app.readContent('tsconfig.json');
      expect(tsConfig.includes('"target": "es5"')).toBe(
        true,
        'Expected `target` to be set to "es5".'
      );
    });

    it('should modify polyfills', async () => {
      await runSchematic(app, {
        project: 'foobar'
      });

      expect(modifyPolyfillsSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          readFile: jasmine.any(Function),
          writeFile: jasmine.any(Function)
        })
      );
    });

    describe('serve', () => {
      it("should throw an error if specified project doesn't include an `architect.serve` property", async () => {
        // Create an incorrectly formatted project config.
        const angularJson = getAngularJson(app);
        delete angularJson.projects.foobar.architect.serve;
        writeAngularJson(app, angularJson);

        await expectAsync(
          runSchematic(app, {
            project: 'foobar'
          })
        ).toBeRejectedWithError(
          'Expected node projects/foobar/architect/serve in angular.json!'
        );
      });
    });

    describe('test', () => {
      it("should throw an error if specified project doesn't include an `architect.test` property", async () => {
        // Create an incorrectly formatted project config.
        const angularJson = getAngularJson(app);
        delete angularJson.projects.foobar.architect.test;
        writeAngularJson(app, angularJson);

        await expectAsync(
          runSchematic(app, {
            project: 'foobar'
          })
        ).toBeRejectedWithError(
          'Expected node projects/foobar/architect/test in angular.json!'
        );
      });

      it("should modify the app's karma.conf.js file", async () => {
        await runSchematic(app, {
          project: 'foobar'
        });

        const contents = app.read('karma.conf.js')?.toString();
        expect(contents).toContain('DO NOT MODIFY');
      });

      it('should set codeCoverage', async () => {
        await runSchematic(app, {
          project: 'foobar'
        });

        const angularJson = getAngularJson(app);
        const options = angularJson.projects.foobar.architect.test.options;
        expect(options.codeCoverage).toEqual(true);
      });
    });
  });

  describe('> Library as default project >', () => {
    let defaultProjectName: string;
    let tree: UnitTestTree;

    beforeEach(async () => {
      defaultProjectName = 'foo-lib';
      tree = (
        await createTestLibrary(runner, {
          defaultProjectName
        })
      ).appTree;
    });

    it('should run the NodePackageInstallTask', async () => {
      await runSchematic(tree, {
        project: defaultProjectName
      });

      expect(runner.tasks.some((task) => task.name === 'node-package')).toEqual(
        true,
        'Expected the schematic to setup a package install step.'
      );
    });

    it('should generate an empty skyuxconfig.json file', async () => {
      await runSchematic(tree, {
        project: defaultProjectName
      });

      const skyuxconfigJson = JSON.parse(tree.readContent('skyuxconfig.json'));
      expect(skyuxconfigJson).toEqual({
        $schema:
          './node_modules/@skyux-sdk/angular-builders/skyuxconfig-schema.json'
      });
    });

    it('should modify angular.json', async () => {
      await runSchematic(tree, {
        project: defaultProjectName
      });

      const angularJson = getAngularJson(tree);
      const testConfig =
        angularJson.projects[defaultProjectName].architect.test;
      expect(testConfig.builder).toEqual('@skyux-sdk/angular-builders:karma');
      expect(testConfig.options.codeCoverage).toEqual(true);
    });

    it("should modify the app's karma.conf.js file", async () => {
      await runSchematic(tree, {
        project: defaultProjectName
      });

      const contents = tree
        .read(`projects/${defaultProjectName}/karma.conf.js`)
        ?.toString();
      expect(contents).toContain('DO NOT MODIFY');
    });

    it("should throw an error if specified project doesn't include an `architect.test` property", async () => {
      // Create an incorrectly formatted project config.
      const angularJson = getAngularJson(tree);
      delete angularJson.projects[defaultProjectName].architect.test;
      writeAngularJson(tree, angularJson);

      await expectAsync(
        runSchematic(tree, {
          project: defaultProjectName
        })
      ).toBeRejectedWithError(
        `Expected node projects/${defaultProjectName}/architect/test in angular.json!`
      );
    });

    it('should add packages to package.json', async () => {
      await runSchematic(tree, {
        project: defaultProjectName
      });

      const packageJson = JSON.parse(tree.readContent('package.json'));
      expect(packageJson.dependencies).toEqual(
        jasmine.objectContaining({
          '@skyux/theme': '^5.0.0-alpha.0'
        })
      );
      expect(packageJson.devDependencies).toEqual(
        jasmine.objectContaining({
          '@skyux-sdk/testing': '^4.0.0'
        })
      );
    });
  });
});
