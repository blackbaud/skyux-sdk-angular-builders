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

});
