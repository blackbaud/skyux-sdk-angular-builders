import {
  Injectable
} from '@angular/core';

@Injectable()
export class SkyuxStartupService {

  public get config(): any {
    return this._config;
  }

  private _config: any;

  public init(config: any): void {
    this._config = config;
  }

}
