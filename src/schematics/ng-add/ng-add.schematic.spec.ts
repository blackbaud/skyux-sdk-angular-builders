import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';

import path from 'path';

import {
  createTestApp,
  generateTestLibrary
} from '../testing/scaffold';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');

describe('ng-add.schematic', () => {
  let app: UnitTestTree;
  let runner: SchematicTestRunner;
  let workspaceTree: UnitTestTree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', COLLECTION_PATH);

    const result = await createTestApp(runner, {
      defaultProjectName: 'foobar'
    });
    app = result.appTree;
    workspaceTree = result.workspaceTree;
  });

  async function runSchematic(
    tree: UnitTestTree,
    options?: { project?: string }
  ): Promise<void> {
    await runner
      .runSchematicAsync('ng-add', options, tree)
      .toPromise();
  }

  function getAngularJson(app: UnitTestTree): any {
    return JSON.parse(app.readContent('angular.json'));
  }

  function writeAngularJson(app: UnitTestTree, content: any) {
    app.overwrite('angular.json', JSON.stringify(content));
  }

  it('should run the NodePackageInstallTask', async () => {
    await runSchematic(app, {
      project: 'foobar'
    });

    expect(runner.tasks.some(task => task.name === 'node-package')).toEqual(
      true,
      'Expected the schematic to setup a package install step.'
    );
  });

  it('should use the default project if none provided', async () => {
    const emptyOptions = {};
    await expectAsync(
      runSchematic(app, emptyOptions)
    ).not.toBeRejected();
  });

  it('should throw an error if angular.json doesn\'t exist', async () => {
    app.delete('angular.json');

    await expectAsync(
      runSchematic(app, {
        project: 'invalid-foobar'
      })
    ).toBeRejectedWithError('Unable to locate a workspace file for workspace path.');
  });

  it('should throw an error if added directly to library', async () => {
    const library = await generateTestLibrary(runner, workspaceTree, { name: 'foo-lib' });

    await expectAsync(
      runSchematic(library, {
        project: 'foo-lib'
      })
    ).toBeRejectedWithError(
      'You are attempting to add this builder to a library project, ' +
      'but it is designed to be added only to the primary application.'
    );
  });

  it('should throw an error if specified project doesn\'t exist', async () => {
    await expectAsync(
      runSchematic(app, {
        project: 'invalid-project'
      })
    ).toBeRejectedWithError('The "invalid-project" project is not defined in angular.json. Provide a valid project name.');
  });

  it('should throw an error if specified project doesn\'t include an `architect` property', async () => {
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
    ).toBeRejectedWithError('Expected node projects/invalid-project/architect in angular.json!');
  });

  it('should overwrite the default build, serve, test, and e2e architects', async () => {
    await runSchematic(app, {
      project: 'foobar'
    });

    const angularJson = getAngularJson(app);
    expect(angularJson.projects.foobar.architect.build.builder).toEqual('@skyux-sdk/angular-builders:browser');
    expect(angularJson.projects.foobar.architect.serve.builder).toEqual('@skyux-sdk/angular-builders:dev-server');
    expect(angularJson.projects.foobar.architect.test.builder).toEqual('@skyux-sdk/angular-builders:karma');
    expect(angularJson.projects.foobar.architect.e2e.builder).toEqual('@skyux-sdk/angular-builders:protractor');
  });

  it('should add packages to package.json', async () => {
    await runSchematic(app, {
      project: 'foobar'
    });

    const packageJson = JSON.parse(app.readContent('package.json'));
    expect(packageJson.dependencies).toEqual(jasmine.objectContaining({
      '@skyux/assets': '^4.0.0'
    }));
    expect(packageJson.devDependencies).toEqual(jasmine.objectContaining({
      '@skyux-sdk/e2e': '^4.0.0',
      '@skyux-sdk/testing': '^4.0.0'
    }));
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
      $schema: './node_modules/@skyux-sdk/angular-builders/skyuxconfig-schema.json'
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
    app.create('skyuxconfig.json', JSON.stringify({
      app: {
        theming: {
          theme: 'default',
          supportedThemes: [
            'default',
            'modern'
          ]
        }
      }
    }));
    
    await runSchematic(app, {
      project: 'foobar'
    });

    const angularJson = getAngularJson(app);
    expect(angularJson.projects['foobar'].architect.build.options.styles).toEqual([
      '@skyux/theme/css/sky.css',
      '@skyux/theme/css/themes/modern/styles.css',
      'src/styles.css'
    ]);
  });

  it('should overwrite SkyuxModule if it exists', async () => {
    app.create('src/app/__skyux/skyux.module.ts', 'foobar');
    await runSchematic(app, {
      project: 'foobar'
    });
    expect(app.readContent('src/app/__skyux/skyux.module.ts')).not.toEqual('foobar');
  });

  it('should wrap the app component template with the shell component', async () => {

    app.overwrite(
      'src/app/app.component.html',
`<div>
  Some text

  <span>Some more text</span>


</div>`);

    await runSchematic(app, {
      project: 'foobar'
    });

    const appTemplate = app.readContent('src/app/app.component.html');

    expect(appTemplate).toBe(
`<!-- SKY UX SHELL SUPPORT - DO NOT REMOVE -->
<!-- Enables omnibar, help, and other shell components configured in skyuxconfig.json. -->
<skyux-app-shell>
  <div>
    Some text

    <span>Some more text</span>


  </div>
</skyux-app-shell>
`
    );
  });

  it('should not add the shell component to the app component template if it is already present', async () => {
    app.overwrite('src/app/app.component.html', '<skyux-app-shell></skyux-app-shell>');

    await runSchematic(app, {
      project: 'foobar'
    });

    const appTemplate = app.readContent('src/app/app.component.html');

    expect(appTemplate).toBe('<skyux-app-shell></skyux-app-shell>');
  });

  describe('serve', () => {
    it('should throw an error if specified project doesn\'t include an `architect.serve` property', async () => {
      // Create an incorrectly formatted project config.
      const angularJson = getAngularJson(app);
      delete angularJson.projects.foobar.architect.serve;
      writeAngularJson(app, angularJson);

      await expectAsync(
        runSchematic(app, {
          project: 'foobar'
        })
      ).toBeRejectedWithError('Expected node projects/foobar/architect/serve in angular.json!');
    });
  });

  describe('build', () => {
    it('should throw an error if specified project doesn\'t include an `architect.build` property', async () => {
      // Create an incorrectly formatted project config.
      const angularJson = getAngularJson(app);
      delete angularJson.projects.foobar.architect.build;
      writeAngularJson(app, angularJson);

      await expectAsync(
        runSchematic(app, {
          project: 'foobar'
        })
      ).toBeRejectedWithError('Expected node projects/foobar/architect/build in angular.json!');
    });

    it('should set options for browser builder', async () => {
      await runSchematic(app, {
        project: 'foobar'
      });

      const angularJson = getAngularJson(app);
      expect(angularJson.projects.foobar.architect.build.configurations.production.outputHashing).toEqual('bundles');
    });
  });

  describe('test', () => {
    it('should throw an error if specified project doesn\'t include an `architect.test` property', async () => {
      // Create an incorrectly formatted project config.
      const angularJson = getAngularJson(app);
      delete angularJson.projects.foobar.architect.test;
      writeAngularJson(app, angularJson);

      await expectAsync(
        runSchematic(app, {
          project: 'foobar'
        })
      ).toBeRejectedWithError('Expected node projects/foobar/architect/test in angular.json!');
    });

    it('should modify the app\'s karma.conf.js file', async () => {
      await runSchematic(app, {
        project: 'foobar'
      });

      const contents = app.read('karma.conf.js')?.toString();
      expect(contents).toContain('DO NOT MODIFY');
    });

    it('should modify a library\'s karma.conf.js file', async () => {
      const library = await generateTestLibrary(runner, workspaceTree, { name: 'foolib' });

      await runSchematic(library, {
        project: 'foobar'
      });

      const contents = library.read('projects/foolib/karma.conf.js')?.toString();
      expect(contents).toContain('DO NOT MODIFY');
    });

    it('should set codeCoverage and codeCoverageExclude', async () => {
      const library = await generateTestLibrary(runner, workspaceTree, { name: 'foolib' });

      await runSchematic(library, {
        project: 'foobar'
      });

      const angularJson = getAngularJson(library);
      const options = angularJson.projects.foolib.architect.test.options;
      expect(options.codeCoverage).toEqual(true);
      expect(options.codeCoverageExclude).toEqual(['src/app/__skyux/**/*']);
    });
  });

  describe('e2e', () => {
    it('should throw an error if specified project doesn\'t include an `architect.e2e` property', async () => {
      // Create an incorrectly formatted project config.
      const angularJson = getAngularJson(app);
      delete angularJson.projects.foobar.architect.e2e;
      writeAngularJson(app, angularJson);

      await expectAsync(
        runSchematic(app, {
          project: 'foobar'
        })
      ).toBeRejectedWithError('Expected node projects/foobar/architect/e2e in angular.json!');
    });

    it('should modify the app\'s protractor.conf.js file', async () => {
      await runSchematic(app, {
        project: 'foobar'
      });

      const contents = app.read('e2e/protractor.conf.js')?.toString();
      expect(contents).toContain('DO NOT MODIFY');
    });

    it('should modify settings in angular.json', async () => {
      await runSchematic(app, {
        project: 'foobar'
      });

      const angularJson = getAngularJson(app);

      expect(angularJson.projects.foobar.architect.serve.configurations.e2e).toEqual({
        browserTarget: 'foobar:build',
        open: false,
        skyuxOpen: false
      });

      expect(angularJson.projects.foobar.architect.serve.configurations.e2eProduction).toEqual({
        browserTarget: 'foobar:build:production',
        open: false,
        skyuxOpen: false
      });

      expect(angularJson.projects.foobar.architect.e2e.options.devServerTarget).toEqual('foobar:serve:e2e');
      expect(angularJson.projects.foobar.architect.e2e.configurations.production.devServerTarget).toEqual('foobar:serve:e2eProduction');
    });
  });

});
