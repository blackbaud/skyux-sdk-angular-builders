import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SkyViewkeeperModule } from '@skyux/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SkyuxModule } from './__skyux/skyux.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SkyuxModule.forRoot(),
    SkyViewkeeperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
