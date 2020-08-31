export const DEPENDENCIES_MAP: { version: string; test: RegExp; }[] = [
  {
    test: /^@angular\//,
    version: '^10.0.0'
  },
  {
    test: /^@angular-devkit\/build-angular$/,
    version: '~0.1000.8'
  },
  {
    test: /^@skyux(-sdk)?\//,
    version: '^4.0.0-alpha.0'
  },
  {
    test: /^rxjs(-compat)?$/,
    version: '^6.5.5'
  },
  {
    test: /^zone.js$/,
    version: '~0.10.3'
  },
  {
    test: /^tslib$/,
    version: '^2.0.0'
  },
  {
    test: /^ts-node$/,
    version: '~8.3.0'
  },
  {
    test: /^tslint$/,
    version: '~6.1.0'
  },
  {
    test: /^typescript$/,
    version: '~3.9.5'
  },
  {
    test: /^protractor$/,
    version: '~7.0.0'
  },
  {
    test: /^@types\/node$/,
    version: '^12.11.1'
  },
  {
    test: /^@types\/jasmine$/,
    version: '~3.5.0'
  },
  {
    test: /^@types\/jasminewd2$/,
    version: '~2.0.3'
  },
  {
    test: /^codelyzer$/,
    version: '^6.0.0'
  },
  {
    test: /^jasmine-core$/,
    version: '~3.5.0'
  },
  {
    test: /^jasmine-spec-reporter$/,
    version: '~5.0.0'
  },
  {
    test: /^karma$/,
    version: '~5.0.0'
  },
  {
    test: /^karma-chrome-launcher$/,
    version: '~3.1.0'
  },
  {
    test: /^karma-coverage-istanbul-reporter$/,
    version: '~3.0.2'
  },
  {
    test: /^karma-jasmine$/,
    version: '~3.0.0'
  },
  {
    test: /^karma-jasmine-html-reporter$/,
    version: '^1.5.0'
  }
];
