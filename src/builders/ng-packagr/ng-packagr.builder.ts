import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { executeNgPackagrBuilder } from '@angular-devkit/build-angular';
import { JsonObject } from '@angular-devkit/core';

import { inlineExternalResourcesPaths } from './inline-external-resources';
import { SkyuxNgPackagrBuilderOptions } from './schema';

export async function executeSkyuxNgPackagrBuilder(
  options: SkyuxNgPackagrBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> {
  const result = await executeNgPackagrBuilder(options, context).toPromise();
  if (result.error) {
    return result;
  }

  try {
    inlineExternalResourcesPaths(context);
  } catch (err) {
    context.logger.fatal(`[SKY UX] ${(err as Error).message}`);
    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

export default createBuilder<JsonObject & SkyuxNgPackagrBuilderOptions>(
  executeSkyuxNgPackagrBuilder
);
