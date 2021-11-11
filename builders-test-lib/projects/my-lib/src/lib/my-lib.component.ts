import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-my-lib',
  templateUrl: './my-lib.component.html',
  styleUrls: [
    './my-lib.component.scss'
  ]
})
export class MyLibComponent implements OnInit {

  public model: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
