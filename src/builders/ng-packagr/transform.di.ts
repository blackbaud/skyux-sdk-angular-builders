import { InjectionToken } from 'injection-js';
import { Transform } from 'ng-packagr/lib/graph/transform';

export const SKYUX_INLINE_RESOURCES_TRANSFORM_TOKEN =
  new InjectionToken<Transform>('skyux.inlineResourcesTransform');
