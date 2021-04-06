import { Compiler } from 'webpack';

import {
  getFallbackTestCssRule,
  getFallbackTestVariable
} from '../../host-asset-utils';
import {
  modifyScriptContents,
  modifyStylesheetContents
} from '../../webpack-utils';

const PLUGIN_NAME = 'skyux-host-assets-fallback-plugin';

/**
 * Adds fallback tests to all assets being sent to SKY UX Host.
 */
export class SkyuxHostAssetsFallbackPlugin {
  public apply(compiler: Compiler): void {
    compiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {
      // Add a fallback variable to the bottom of the JS source files.
      modifyScriptContents(
        compilation,
        (content, file) =>
          `${content}\nwindow.${getFallbackTestVariable(file)} = true;`
      );

      // Add a fallback CSS rule to the bottom of each style sheet.
      modifyStylesheetContents(
        compilation,
        (content, file) => `${content}\n${getFallbackTestCssRule(file)}`
      );
    });
  }
}
