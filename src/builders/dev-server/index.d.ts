import { BuilderContext } from '@angular-devkit/architect';
import { DevServerBuilderOptions, DevServerBuilderOutput } from '@angular-devkit/build-angular';
import { Observable } from 'rxjs';
export declare const serveCustomWebpackBrowser: (options: DevServerBuilderOptions, context: BuilderContext) => Observable<DevServerBuilderOutput>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<DevServerBuilderOptions>;
export default _default;
