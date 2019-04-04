import { Component, OnInit } from '@angular/core';
import { SpeechToTextService } from 'src/services/speechToText.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(private speechToTextService: SpeechToTextService) {
  }

  ngOnInit(): void {
    // navigator.mediaDevices.enumerateDevices().then((deviceInfos: MediaDeviceInfo[]) => {
    //   const audioDevices = deviceInfos.filter(x => x.kind === 'audioinput');
    //   if (audioDevices.length <= 0) {
    //     console.log('microphones not found');
    //   }
    //   console.log(audioDevices);
    // });

    this.speechToTextService.initialize();
    this.speechToTextService.start();
    this.speechToTextService.speechRecognized().subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    });
  }

  cerca() {
    alert('cerca');
  }


  testvoce() {
    // this.creaAccessToken().subscribe(data => {
    //   const builder = require('xmlbuilder');

    //   console.log(data);
    //   const xml_body = builder.create('speak')
    //     .att('version', '1.0')
    //     .att('xml:lang', 'en-us')
    //     .ele('voice')
    //     .att('xml:lang', 'en-us')
    //     .att('name', 'Microsoft Server Speech Text to Speech Voice (en-US, Guy24KRUS)')
    //     .txt('select balance')
    //     .end();

    //   const body = xml_body.toString();
    //   const _headers: HttpHeaders = new HttpHeaders()
    //     .append('Content-Type', 'application/ssml+xml')
    //     .append('X-Microsoft-OutputFormat', 'riff-24khz-16bit-mono-pcm')
    //     .append('cache-control', 'no-cache')
    //     .append('Authorization', 'Bearer ' + data);

    //   this._http.post('https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1', body, { headers: _headers, responseType: 'blob' })
    //     .subscribe(blob => {
    //       const url = URL.createObjectURL(blob);
    //       // Get DOM elements.
    //       const audio = new Audio();
    //       audio.src = url;
    //       audio.load();
    //       audio.play().catch(function (error) {
    //         console.log(error.message);
    //       });
    //     });
    // });
  }
}
