import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { BitcoinPriceClientComponent } from './components/bitcoin-price-client/bitcoin-price-client.component';
import { BreadArtComponent } from './components/bread-art/bread-art.component';
import { FooterComponent } from './components/footer/footer.component';
import { GithubButtonComponent } from './components/github-button/github-button.component';

@NgModule({
  declarations: [
    AppComponent,
    BitcoinPriceClientComponent,
    BreadArtComponent,
    FooterComponent,
    GithubButtonComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
