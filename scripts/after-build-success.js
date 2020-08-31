const fs = require('fs-extra');
const path = require('path');

function mergeBuilderSchemas() {
  // const schemaConfigs = [
  //   {
  //     baseSchemaPath: './node_modules/@angular-devkit/build-angular/src/browser/schema.json',
  //     schemaPath: './dist/src/builders/browser/schema.ext.json'
  //   },
  //   {
  //     baseSchemaPath: './node_modules/@angular-devkit/build-angular/src/dev-server/schema.json',
  //     schemaPath: './dist/src/builders/dev-server/schema.ext.json'
  //   }
  // ];

  // schemaConfigs.forEach((config) => {
  //   const schemaJson = fs.readJsonSync(path.resolve(config.schemaPath));
  //   const baseSchemaJson = fs.readJsonSync(path.resolve(config.baseSchemaPath));

  //   const newJson = Object.assign({}, baseSchemaJson, schemaJson);
  //   newJson.properties = Object.assign({}, baseSchemaJson.properties, schemaJson.properties || {});

  //   fs.writeJsonSync(path.join('dist', config.schemaPath), newJson, {
  //     encoding: 'utf8',
  //     spaces: 2
  //   });
  // });
}

mergeBuilderSchemas();
