import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SpeechToTextService } from 'src/services/speechToText.service';
import { TextToSpeechService } from 'src/services/textToSpeech.service';
import { ServiceHelper } from 'src/helpers/service.helper';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSlideToggleModule
  ],
  providers: [
    SpeechToTextService,
    TextToSpeechService,
    ServiceHelper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
