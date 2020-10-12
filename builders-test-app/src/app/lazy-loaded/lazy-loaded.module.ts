import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  LazyLoadedRoutingModule
} from './lazy-loaded-routing.module';

import {
  LazyLoadedComponent
} from './lazy-loaded.component';

@NgModule({
  imports: [
    CommonModule,
    LazyLoadedRoutingModule
  ],
  exports: [
    LazyLoadedComponent
  ],
  declarations: [
    LazyLoadedComponent
  ]
})
export class LazyLoadedModule { }
