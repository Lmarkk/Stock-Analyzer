import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppUpwardTrendComponent } from './app-upward-trend/app-upward-trend.component';
import { AppVolumePriceChangeComponent } from './app-volume-price-change/app-volume-price-change.component';
import { AppOpenPriceSmaComponent } from './app-open-price-sma/app-open-price-sma.component';

@NgModule({
  declarations: [
    AppComponent,
    AppUpwardTrendComponent,
    AppVolumePriceChangeComponent,
    AppOpenPriceSmaComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
