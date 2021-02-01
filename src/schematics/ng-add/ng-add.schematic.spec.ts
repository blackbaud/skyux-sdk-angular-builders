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

  it('should update package.json', async () => {
    await runner
      .runSchematicAsync('ng-add', { project: 'foobar' }, app)
      .toPromise();

    expect(runner.tasks.some(task => task.name === 'node-package')).toEqual(
      true,
      'Expected the schematic to setup a package install step.'
    );
  });

  it('should throw an error if angular.json doesn\'t exist', async () => {
    app.delete('angular.json');

    await expectAsync(
      runner
        .runSchematicAsync('ng-add', { project: 'invalid-project' }, app)
        .toPromise()
    ).toBeRejectedWithError('Not an Angular CLI workspace.');
  });

  it('should throw an error if specified project doesn\'t exist', async () => {
    await expectAsync(
      runner
        .runSchematicAsync('ng-add', { project: 'invalid-project' }, app)
        .toPromise()
    ).toBeRejectedWithError('The "invalid-project" project is not defined in angular.json. Provide a valid project name.');
  });

  it('should throw an error if specified project doesn\'t include an `architect` property', async () => {
    // Create an incorrectly formatted project config.
    const angularJson = JSON.parse(app.readContent('angular.json'));
    angularJson.projects['invalid-project'] = {};
    app.overwrite('angular.json', JSON.stringify(angularJson));

    await expectAsync(
      runner
        .runSchematicAsync('ng-add', { project: 'invalid-project' }, app)
        .toPromise()
    ).toBeRejectedWithError('Expected node projects/invalid-project/architect in angular.json!');
  });

  it('should overwrite the default build, serve, test, and e2e architects', async () => {
    await runner
      .runSchematicAsync('ng-add', { project: 'foobar' }, app)
      .toPromise();

    const angularJson = JSON.parse(app.readContent('angular.json'));

    expect(angularJson.projects.foobar.architect.build.builder).toEqual('@skyux-sdk/angular-builders:browser');
    expect(angularJson.projects.foobar.architect.serve.builder).toEqual('@skyux-sdk/angular-builders:dev-server');
    expect(angularJson.projects.foobar.architect.test.builder).toEqual('@skyux-sdk/angular-builders:karma');
    expect(angularJson.projects.foobar.architect.e2e.builder).toEqual('@skyux-sdk/angular-builders:protractor');
  });

  it('should set options for browser builder', async () => {
    await runner
      .runSchematicAsync('ng-add', { project: 'foobar' }, app)
      .toPromise();

    const angularJson = JSON.parse(app.readContent('angular.json'));

    expect(angularJson.projects.foobar.architect.build.configurations.production.outputHashing).toEqual('bundles');
  });

  it('should throw an error if specified project doesn\'t include an `architect.serve` property', async () => {
    // Create an incorrectly formatted project config.
    const angularJson = JSON.parse(app.readContent('angular.json'));
    delete angularJson.projects.foobar.architect.serve;
    app.overwrite('angular.json', JSON.stringify(angularJson));

    await expectAsync(
      runner
        .runSchematicAsync('ng-add', { project: 'foobar' }, app)
        .toPromise()
    ).toBeRejectedWithError('Expected node projects/foobar/architect/serve in angular.json!');
  });

  it('should throw an error if specified project doesn\'t include an `architect.build` property', async () => {
    // Create an incorrectly formatted project config.
    const angularJson = JSON.parse(app.readContent('angular.json'));
    delete angularJson.projects.foobar.architect.build;
    app.overwrite('angular.json', JSON.stringify(angularJson));

    await expectAsync(
      runner
        .runSchematicAsync('ng-add', { project: 'foobar' }, app)
        .toPromise()
    ).toBeRejectedWithError('Expected node projects/foobar/architect/build in angular.json!');
  });

  it('should throw an error if specified project doesn\'t include an `architect.test` property', async () => {
    // Create an incorrectly formatted project config.
    const angularJson = JSON.parse(app.readContent('angular.json'));
    delete angularJson.projects.foobar.architect.test;
    app.overwrite('angular.json', JSON.stringify(angularJson));

    await expectAsync(
      runner
        .runSchematicAsync('ng-add', { project: 'foobar' }, app)
        .toPromise()
    ).toBeRejectedWithError('Expected node projects/foobar/architect/test in angular.json!');
  });

  it('should modify the app\'s karma.conf.js file', async () => {
    await runner
      .runSchematicAsync('ng-add', { project: 'foobar' }, app)
      .toPromise();

    const contents = app.read('karma.conf.js')?.toString();
    expect(contents).toContain('DO NOT MODIFY');
  });

  it('should modify a library\'s karma.conf.js file', async () => {
    const library = await generateTestLibrary(runner, workspaceTree, { name: 'foolib' });

    await runner
      .runSchematicAsync('ng-add', { project: 'foobar' }, app)
      .toPromise();

    const contents = library.read('projects/foolib/karma.conf.js')?.toString();
    expect(contents).toContain('DO NOT MODIFY');
  });

  it('should throw an error if specified project doesn\'t include an `architect.e2e` property', async () => {
    // Create an incorrectly formatted project config.
    const angularJson = JSON.parse(app.readContent('angular.json'));
    delete angularJson.projects.foobar.architect.e2e;
    app.overwrite('angular.json', JSON.stringify(angularJson));

    await expectAsync(
      runner
        .runSchematicAsync('ng-add', { project: 'foobar' }, app)
        .toPromise()
    ).toBeRejectedWithError('Expected node projects/foobar/architect/e2e in angular.json!');
  });

  it('should modify the app\'s protractor.conf.js file', async () => {
    await runner
      .runSchematicAsync('ng-add', { project: 'foobar' }, app)
      .toPromise();

    const contents = app.read('e2e/protractor.conf.js')?.toString();
    expect(contents).toContain('DO NOT MODIFY');
  });

});
