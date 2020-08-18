"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const architect_1 = require("@angular-devkit/architect");
const build_angular_1 = require("@angular-devkit/build-angular");
function skyuxBrowser(options, context, transforms = {}) {
    console.log('Validating our custom builder (skyuxBrowser) is called.');
    transforms.webpackConfiguration = (config) => {
        config.plugins = config.plugins || [];
        config.plugins.push(function ConsoleLogPlugin(compiler) {
            compiler.hooks.done.tap('ConsoleLogPlugin', () => {
                console.log('I AM DONE!');
            });
        });
        // config.plugins.push(SaveMetadataOriginal);
        return config;
    };
    return build_angular_1.executeBrowserBuilder(options, context, transforms);
}
exports.default = architect_1.createBuilder(skyuxBrowser);
//# sourceMappingURL=index.js.map