import {
  Injectable
} from '@angular/core';

import {
  SkyAppSetTitleArgs
} from '@skyux/core';

declare const BBAuthClient: any;

@Injectable()
export class SkyAppOmnibarTitleService {

  public setTitle(args: SkyAppSetTitleArgs): void {
    BBAuthClient.BBOmnibar.setTitle(args);
  }

}
