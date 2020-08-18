"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCustomWebpackBrowser = void 0;
const architect_1 = require("@angular-devkit/architect");
const build_angular_1 = require("@angular-devkit/build-angular");
// import {
//   Transforms
// } from '../shared/transforms.model';
// import * as webpack from 'webpack';
// const skyuxDevServer  = (
//   options: any,
//   context: BuilderContext,
//   transforms: Transforms = {}
// ): Observable<DevServerBuilderOutput> => {
//   console.log('Validating our custom builder (skyuxDevServer) is called.');
//   console.log(options);
//   return executeDevServerBuilder(options, context, transforms);
// }
// export default createBuilder<DevServerBuilderOptions, DevServerBuilderOutput>(skyuxDevServer);
exports.serveCustomWebpackBrowser = (options, context) => {
    console.log('RUNNING CUSTOM BUILD ANGULAR BUILDER SKY UX2');
    return build_angular_1.executeDevServerBuilder(options, context);
};
exports.default = architect_1.createBuilder(exports.serveCustomWebpackBrowser);
//# sourceMappingURL=index.js.map