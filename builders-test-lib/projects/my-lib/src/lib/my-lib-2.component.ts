import { Component } from '@angular/core';

@Component({
  selector: 'lib-my-lib-2',
  templateUrl: './my-lib-2.component.html',
  styleUrls: [
    './my-lib-2a.component.scss',
    './my-lib-2b.component.scss'
  ]
})
export class MyLibComponent2 {

  public model: string | undefined;

}
