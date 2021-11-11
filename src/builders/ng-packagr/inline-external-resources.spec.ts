import mock from 'mock-require';

describe('inline-external-resources', () => {
  let bundleExists: boolean;
  let fsExtraSpyObj: jasmine.SpyObj<any>;
  let globResult: string[];
  let globSpyObj: jasmine.SpyObj<any>;
  let mockBundleContents: string;
  let mockContext: any;

  beforeEach(() => {
    mockBundleContents = `(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms')) :
  typeof define === 'function' && define.amd ? define('my-lib', ['exports', '@angular/core', '@angular/forms'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["my-lib"] = {}, global.ng.core, global.ng.forms));
})(this, (function (exports, i0, i1) { 'use strict';

  function _interopNamespace(e) {
      if (e && e.__esModule) return e;
      var n = Object.create(null);
      if (e) {
          Object.keys(e).forEach(function (k) {
              if (k !== 'default') {
                  var d = Object.getOwnPropertyDescriptor(e, k);
                  Object.defineProperty(n, k, d.get ? d : {
                      enumerable: true,
                      get: function () { return e[k]; }
                  });
              }
          });
      }
      n["default"] = e;
      return Object.freeze(n);
  }

  var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
  var i1__namespace = /*#__PURE__*/_interopNamespace(i1);

  var MyLibService = /** @class */ (function () {
      function MyLibService() {
      }
      return MyLibService;
  }());
  MyLibService.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibService, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable });
  MyLibService.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibService, providedIn: 'root' });
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibService, decorators: [{
              type: i0.Injectable,
              args: [{
                      providedIn: 'root'
                  }]
          }], ctorParameters: function () { return []; } });

  var MyLibComponent = /** @class */ (function () {
      function MyLibComponent() {
      }
      MyLibComponent.prototype.ngOnInit = function () {
      };
      return MyLibComponent;
  }());
  MyLibComponent.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibComponent, deps: [], target: i0__namespace.ɵɵFactoryTarget.Component });
  MyLibComponent.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.13", type: MyLibComponent, selector: "lib-my-lib", ngImport: i0__namespace, template: "<p style=\"size:15px;\" [ngModel]=\"model\">\n  my-lib works!\n</p>\n", styles: ["p{color:red}\n"], directives: [{ type: i1__namespace.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i1__namespace.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibComponent, decorators: [{
              type: i0.Component,
              args: [{
                      selector: 'lib-my-lib',
                      templateUrl: './my-lib.component.html',
                      styleUrls: [
                          './my-lib.component.scss'
                      ]
                  }]
          }], ctorParameters: function () { return []; } });

  var MyLibComponent2 = /** @class */ (function () {
      function MyLibComponent2() {
      }
      return MyLibComponent2;
  }());
  MyLibComponent2.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibComponent2, deps: [], target: i0__namespace.ɵɵFactoryTarget.Component });
  MyLibComponent2.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.13", type: MyLibComponent2, selector: "lib-my-lib-2", ngImport: i0__namespace, template: "<p style=\"font-style: oblique;\" [ngModel]=\"model\">\n  my-lib-2 works!\n</p>\n", styles: ["p{color:\"darkmagenta\"}\n", "p{color:\"green\"}\n"], directives: [{ type: i1__namespace.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i1__namespace.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibComponent2, decorators: [{
              type: i0.Component,
              args: [{
                      selector: 'lib-my-lib-2',
                      templateUrl: './my-lib-2.component.html',
                      styleUrls: [
                          './my-lib-2a.component.scss',
                          './my-lib-2b.component.scss'
                      ]
                  }]
          }] });

  var MyLibModule = /** @class */ (function () {
      function MyLibModule() {
      }
      return MyLibModule;
  }());
  MyLibModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule });
  MyLibModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibModule, declarations: [MyLibComponent,
          MyLibComponent2], imports: [i1.FormsModule], exports: [MyLibComponent,
          MyLibComponent2] });
  MyLibModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibModule, imports: [[
              i1.FormsModule
          ]] });
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibModule, decorators: [{
              type: i0.NgModule,
              args: [{
                      declarations: [
                          MyLibComponent,
                          MyLibComponent2
                      ],
                      imports: [
                          i1.FormsModule
                      ],
                      exports: [
                          MyLibComponent,
                          MyLibComponent2
                      ]
                  }]
          }] });

  /*
    * Public API Surface of my-lib
    */

  /**
   * Generated bundle index. Do not edit.
   */

  exports.MyLibComponent = MyLibComponent;
  exports.MyLibComponent2 = MyLibComponent2;
  exports.MyLibModule = MyLibModule;
  exports.MyLibService = MyLibService;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=my-lib.umd.js.map
`;

    mockContext = {
      target: {
        project: 'my-lib',
      },
      workspaceRoot: 'MOCK_WORKSPACE_ROOT',
    };

    fsExtraSpyObj = jasmine.createSpyObj('fs-extra', [
      'existsSync',
      'readFileSync',
      'writeFileSync',
    ]);

    bundleExists = true;
    fsExtraSpyObj.existsSync.and.callFake(() => bundleExists);
    fsExtraSpyObj.readFileSync.and.callFake(() =>
      Buffer.from(mockBundleContents)
    );

    mock('fs-extra', fsExtraSpyObj);

    globSpyObj = jasmine.createSpyObj('glob', ['sync']);

    globResult = ['my-lib.umd.js'];
    globSpyObj.sync.and.callFake(() => globResult);

    mock('glob', globSpyObj);
  });

  afterEach(() => {
    mock.stopAll();
  });

  function getUtil() {
    return mock.reRequire('./inline-external-resources');
  }

  it('should replace `templateUrl` and `styleUrls`', () => {
    const { inlineExternalResourcesPaths } = getUtil();

    inlineExternalResourcesPaths(mockContext);

    expect(fsExtraSpyObj.writeFileSync).toHaveBeenCalledWith(
      'my-lib.umd.js',
      `(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms')) :
  typeof define === 'function' && define.amd ? define('my-lib', ['exports', '@angular/core', '@angular/forms'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["my-lib"] = {}, global.ng.core, global.ng.forms));
})(this, (function (exports, i0, i1) { 'use strict';

  function _interopNamespace(e) {
      if (e && e.__esModule) return e;
      var n = Object.create(null);
      if (e) {
          Object.keys(e).forEach(function (k) {
              if (k !== 'default') {
                  var d = Object.getOwnPropertyDescriptor(e, k);
                  Object.defineProperty(n, k, d.get ? d : {
                      enumerable: true,
                      get: function () { return e[k]; }
                  });
              }
          });
      }
      n["default"] = e;
      return Object.freeze(n);
  }

  var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
  var i1__namespace = /*#__PURE__*/_interopNamespace(i1);

  var MyLibService = /** @class */ (function () {
      function MyLibService() {
      }
      return MyLibService;
  }());
  MyLibService.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibService, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable });
  MyLibService.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibService, providedIn: 'root' });
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibService, decorators: [{
              type: i0.Injectable,
              args: [{
                      providedIn: 'root'
                  }]
          }], ctorParameters: function () { return []; } });

  var MyLibComponent = /** @class */ (function () {
      function MyLibComponent() {
      }
      MyLibComponent.prototype.ngOnInit = function () {
      };
      return MyLibComponent;
  }());
  MyLibComponent.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibComponent, deps: [], target: i0__namespace.ɵɵFactoryTarget.Component });
  MyLibComponent.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.13", type: MyLibComponent, selector: "lib-my-lib", ngImport: i0__namespace, template: "<p style="size:15px;" [ngModel]="model">
  my-lib works!
</p>
", styles: ["p{color:red}
"], directives: [{ type: i1__namespace.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i1__namespace.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibComponent, decorators: [{
              type: i0.Component,
              args: [{
                      selector: 'lib-my-lib',
                      template: "<p style=",
                      styles: ["p{color:red}
"]
                  }]
          }], ctorParameters: function () { return []; } });

  var MyLibComponent2 = /** @class */ (function () {
      function MyLibComponent2() {
      }
      return MyLibComponent2;
  }());
  MyLibComponent2.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibComponent2, deps: [], target: i0__namespace.ɵɵFactoryTarget.Component });
  MyLibComponent2.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.13", type: MyLibComponent2, selector: "lib-my-lib-2", ngImport: i0__namespace, template: "<p style="font-style: oblique;" [ngModel]="model">
  my-lib-2 works!
</p>
", styles: ["p{color:"darkmagenta"}
", "p{color:"green"}
"], directives: [{ type: i1__namespace.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i1__namespace.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibComponent2, decorators: [{
              type: i0.Component,
              args: [{
                      selector: 'lib-my-lib-2',
                      template: "<p style=",
                      styles: ["p{color:"darkmagenta"}
", "p{color:"green"}
"]
                  }]
          }] });

  var MyLibModule = /** @class */ (function () {
      function MyLibModule() {
      }
      return MyLibModule;
  }());
  MyLibModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule });
  MyLibModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibModule, declarations: [MyLibComponent,
          MyLibComponent2], imports: [i1.FormsModule], exports: [MyLibComponent,
          MyLibComponent2] });
  MyLibModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibModule, imports: [[
              i1.FormsModule
          ]] });
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibModule, decorators: [{
              type: i0.NgModule,
              args: [{
                      declarations: [
                          MyLibComponent,
                          MyLibComponent2
                      ],
                      imports: [
                          i1.FormsModule
                      ],
                      exports: [
                          MyLibComponent,
                          MyLibComponent2
                      ]
                  }]
          }] });

  /*
    * Public API Surface of my-lib
    */

  /**
   * Generated bundle index. Do not edit.
   */

  exports.MyLibComponent = MyLibComponent;
  exports.MyLibComponent2 = MyLibComponent2;
  exports.MyLibModule = MyLibModule;
  exports.MyLibService = MyLibService;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=my-lib.umd.js.map
`,
      { encoding: 'utf-8' }
    );
  });

  it('should throw an error if `templateUrl` or `styleUrls` are found but not replaced', () => {
    mockBundleContents += '{templateUrl: ""}';

    const { inlineExternalResourcesPaths } = getUtil();

    expect(() => inlineExternalResourcesPaths(mockContext)).toThrowError(
      'Relative file paths pointing to external resources were found in a component definition (e.g. `templateUrl` or `styleUrls`). The `@skyux-sdk/angular-builders:ng-packagr` builder should have replaced these paths with the file contents inlined (e.g. `template`, `styles`), but the file structure of the bundle has likely changed. Please report this problem to the author of `@skyux-sdk/angular-builders:ng-packagr`.'
    );
  });

  it('should throw an error if bundle not found', () => {
    bundleExists = false;

    const { inlineExternalResourcesPaths } = getUtil();

    expect(() => inlineExternalResourcesPaths(mockContext)).toThrowError(
      "The UMD bundle was not found. (wanted 'my-lib.umd.js')"
    );
  });

  it('should handle empty bundle file', () => {
    mockBundleContents = '';

    const { inlineExternalResourcesPaths } = getUtil();

    inlineExternalResourcesPaths(mockContext);

    expect(fsExtraSpyObj.writeFileSync).toHaveBeenCalledWith(
      'my-lib.umd.js',
      '',
      { encoding: 'utf-8' }
    );
  });

  it('should handle bundle without components', () => {
    mockBundleContents = `
  var MyLibService = /** @class */ (function () {
      function MyLibService() {
      }
      return MyLibService;
  }());
  MyLibService.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibService, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable });
  MyLibService.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibService, providedIn: 'root' });
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibService, decorators: [{
              type: i0.Injectable,
              args: [{
                      providedIn: 'root'
                  }]
          }], ctorParameters: function () { return []; } });

  var MyLibModule = /** @class */ (function () {
      function MyLibModule() {
      }
      return MyLibModule;
  }());
  MyLibModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule });
  MyLibModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibModule, declarations: [MyLibComponent,
          MyLibComponent2], imports: [i1.FormsModule], exports: [MyLibComponent,
          MyLibComponent2] });
  MyLibModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibModule, imports: [[
              i1.FormsModule
          ]] });
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.13", ngImport: i0__namespace, type: MyLibModule, decorators: [{
              type: i0.NgModule,
              args: [{
                      declarations: [
                          MyLibComponent,
                          MyLibComponent2
                      ],
                      imports: [
                          i1.FormsModule
                      ],
                      exports: [
                          MyLibComponent,
                          MyLibComponent2
                      ]
                  }]
          }] });

  /*
    * Public API Surface of my-lib
    */

  /**
   * Generated bundle index. Do not edit.
   */

  exports.MyLibComponent = MyLibComponent;
  exports.MyLibComponent2 = MyLibComponent2;
  exports.MyLibModule = MyLibModule;
  exports.MyLibService = MyLibService;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=my-lib.umd.js.map
`;

    const { inlineExternalResourcesPaths } = getUtil();

    inlineExternalResourcesPaths(mockContext);

    expect(fsExtraSpyObj.writeFileSync).toHaveBeenCalledWith(
      'my-lib.umd.js',
      mockBundleContents,
      { encoding: 'utf-8' }
    );
  });
});
