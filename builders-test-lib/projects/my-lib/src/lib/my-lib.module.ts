import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MyLibComponent2 } from './my-lib-2.component';
import { MyLibComponent } from './my-lib.component';

@NgModule({
  declarations: [
    MyLibComponent,
    MyLibComponent2
  ],
  imports: [
    FormsModule
  ],
  exports: [
    MyLibComponent,
    MyLibComponent2
  ]
})
export class MyLibModule { }
