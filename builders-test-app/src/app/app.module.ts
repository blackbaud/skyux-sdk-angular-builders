import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  __SkyuxModule
} from './__skyux/skyux.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    __SkyuxModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
