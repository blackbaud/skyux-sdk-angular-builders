import {
  SchematicTestRunner
} from '@angular-devkit/schematics/testing';

import path from 'path';

import {
  createTestApp
} from '../testing/scaffold';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');

describe('ng-add.schematic', () => {
  let runner: SchematicTestRunner;

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', COLLECTION_PATH);
  });

  it('should update package.json', async () => {
    const app = await createTestApp(runner);
    await runner
      .runSchematicAsync('ng-add', { project: 'foobar' }, app)
      .toPromise();

    expect(runner.tasks.some(task => task.name === 'node-package')).toEqual(
      true,
      'Expected the schematic to setup a package install step.'
    );
  });

  it('should throw an error if specified project doesn\'t exist', async () => {
    const app = await createTestApp(runner);

    await expectAsync(
      runner
        .runSchematicAsync('ng-add', { project: 'invalid-project' }, app)
        .toPromise()
    ).toBeRejectedWithError('The "invalid-project" project is not defined in angular.json. Provide a valid project name.');
  });

  it('should throw an error if specified project doesn\'t include an `architect` property', async () => {
    const app = await createTestApp(runner);

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

  it('should overwrite the default build and serve architects', async () => {
    const app = await createTestApp(runner);
    await runner
      .runSchematicAsync('ng-add', { project: 'foobar' }, app)
      .toPromise();

    const angularJson = JSON.parse(app.readContent('angular.json'));

    expect(angularJson.projects.foobar.architect.build.builder).toEqual('@skyux-sdk/angular-builders:browser');
    expect(angularJson.projects.foobar.architect.serve.builder).toEqual('@skyux-sdk/angular-builders:dev-server');
  });

  it('should throw an error if specified project doesn\'t include an `architect.serve` property', async () => {
    const app = await createTestApp(runner);

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
    const app = await createTestApp(runner);

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

});
