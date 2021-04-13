import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';

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
    SkyI18nModule,
    SkyuxModule.forRoot(),
    SkyViewkeeperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
