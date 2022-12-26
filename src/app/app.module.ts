import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgxMicRecorderModule } from 'ngx-mic-recorder';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxMicRecorderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
