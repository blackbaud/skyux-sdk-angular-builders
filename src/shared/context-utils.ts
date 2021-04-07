import { BuilderContext } from '@angular-devkit/architect';

export function getBaseHref(context: BuilderContext): string {
  return `/${context.target!.project!}/`;
}
