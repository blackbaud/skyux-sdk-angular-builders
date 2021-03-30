const fs = require('fs-extra');
const path = require('path');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

const TEST_PROJECT_DIR = argv['test-dir'] || 'builders-test-app';
const TEST_DIST = `${TEST_PROJECT_DIR}/.skyux-sdk-angular-builders-dist`;

function cleanDist() {
  require('rimraf').sync(path.join(TEST_DIST));
}

function copyFilesToDist() {
  const pathsToCopy = [
    ['README.md'],
    ['CHANGELOG.md'],
    ['package.json'],
    ['builders.json'],
    ['collection.json'],
    ['src/schematics/ng-add/files']
  ];

  pathsToCopy.forEach(pathArr => {
    const sourcePath = path.join(...pathArr);
    const distPath = path.join('dist', ...pathArr);
    if (fs.existsSync(sourcePath)) {
      fs.copySync(sourcePath, distPath);
      console.log(`Successfully copied ${sourcePath} to ${distPath}`);
    } else {
      throw `File not found: ${sourcePath}`;
    }
  });

  fs.copySync('dist', path.join(TEST_DIST));
}

function mergeBuilderSchema(baseSchemaPath, schemaPath) {
  const schemaJson = fs.readJsonSync(path.join(process.cwd(), schemaPath));
  const baseSchemaJson = fs.readJsonSync(path.join(process.cwd(), baseSchemaPath));

  const newJson = Object.assign({}, baseSchemaJson, schemaJson);
  newJson.properties = Object.assign({}, baseSchemaJson.properties, schemaJson.properties || {});

  console.log(
    '\n===========\nMERGING SCHEMAS:\n',
    baseSchemaPath, '\n',
    schemaPath, '\n',
    baseSchemaJson.properties, '\n',
    schemaJson.properties,
    newJson.properties, '\n',
    '\n\n\n\n'
  );

  fs.writeJsonSync(path.join(process.cwd(), schemaPath), newJson);

  console.log(`Successfully merged ${schemaPath}`);
}

function mergeBuilderSchemas() {
  mergeBuilderSchema(
    './node_modules/@angular-devkit/build-angular/src/browser/schema.json',
    './dist/src/builders/browser/schema.ext.json'
  );
  mergeBuilderSchema(
    './node_modules/@angular-devkit/build-angular/src/dev-server/schema.json',
    './dist/src/builders/dev-server/schema.ext.json'
  );
  mergeBuilderSchema(
    './node_modules/@angular-devkit/build-angular/src/karma/schema.json',
    './dist/src/builders/karma/schema.ext.json'
  );
  mergeBuilderSchema(
    './node_modules/@angular-devkit/build-angular/src/protractor/schema.json',
    './dist/src/builders/protractor/schema.ext.json'
  );
}

function copyDistToNodeModules() {
  fs.copySync(
    path.join(process.cwd(), 'dist'),
    path.join(__dirname, '../', TEST_PROJECT_DIR, 'node_modules', '@skyux-sdk/angular-builders')
  );

  console.log(`Successfully copied 'dist' to '${TEST_PROJECT_DIR}/node_modules'.`);
}

cleanDist();
copyFilesToDist();
mergeBuilderSchemas();
copyDistToNodeModules();
