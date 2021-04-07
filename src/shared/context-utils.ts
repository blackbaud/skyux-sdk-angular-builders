import { BuilderContext } from '@angular-devkit/architect';

/**
 * Returns the project's context, wrapped in forward slashes (e.g., '/my-project/').
 * This value will be used as the base href for the server URL.
 */
export function getBaseHref(context: BuilderContext): string {
  return `/${context.target!.project!}/`;
}
