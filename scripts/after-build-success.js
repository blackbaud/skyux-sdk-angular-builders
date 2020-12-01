const fs = require('fs-extra');
const path = require('path');

function copyFilesToDist() {
  const pathsToCopy = [
    ['README.md'],
    ['CHANGELOG.md'],
    ['package.json'],
    ['builders.json'],
    ['collection.json']
    // ['src', 'builders', 'karma', 'karma.default.conf.js']
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
}

function mergeBuilderSchemas() {
  const schemaConfigs = [
    {
      baseSchemaPath: './node_modules/@angular-devkit/build-angular/src/browser/schema.json',
      schemaPath: './dist/src/builders/browser/schema.ext.json'
    },
    {
      baseSchemaPath: './node_modules/@angular-devkit/build-angular/src/dev-server/schema.json',
      schemaPath: './dist/src/builders/dev-server/schema.ext.json'
    },
    {
      baseSchemaPath: './node_modules/@angular-devkit/build-angular/src/karma/schema.json',
      schemaPath: './dist/src/builders/karma/schema.ext.json'
    }
  ];

  schemaConfigs.forEach((config) => {
    const schemaJson = fs.readJsonSync(path.resolve(config.schemaPath));
    const baseSchemaJson = fs.readJsonSync(path.resolve(config.baseSchemaPath));

    const newJson = Object.assign({}, baseSchemaJson, schemaJson);
    newJson.properties = Object.assign({}, baseSchemaJson.properties, schemaJson.properties || {});

    fs.writeJsonSync(config.schemaPath, newJson, {
      encoding: 'utf8',
      spaces: 2
    });

    console.log(`Successfully merged ${config.schemaPath}`);
  });
}

function copyDistToNodeModules() {
  fs.copySync('dist', path.join('builders-test-app', 'node_modules', '@skyux-sdk/angular-builders'));
}

copyFilesToDist();
mergeBuilderSchemas();
copyDistToNodeModules();
