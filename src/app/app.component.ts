import { Component, OnInit } from '@angular/core';
import { SpeechToTextService } from 'src/services/speechToText.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var require: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(private speechToTextService: SpeechToTextService,
    private _http: HttpClient) {
  }

  ngOnInit(): void {
    // this.speechToTextService.initialize();
    // this.speechToTextService.start();
    // this.speechToTextService.speechRecognized().subscribe(data => {
    //   console.log(data);
    // }, err => {
    //   console.log(err);
    // });
  }

  cerca() {
    alert('cerca');
  }

  creaAccessToken(): Observable<string> {
    let _headers: HttpHeaders = new HttpHeaders();
    _headers = _headers.append('Content-Type', 'application/json');
    _headers = _headers.append(
      'Ocp-Apim-Subscription-Key', '79504b01445a4150aa6b426f210c5634'
    );

    return this._http.post('https://westeurope.api.cognitive.microsoft.com/sts/v1.0/issuetoken', '', { headers: _headers, responseType: 'text' }
    );
  }


  testvoce() {
    // const _accessToken = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ1cm46bXMuY29nbml0aXZlc2VydmljZXMiLCJleHAiOiIxNTU0MzA1MjUxIiwicmVnaW9uIjoid2VzdGV1cm9wZSIsInN1YnNjcmlwdGlvbi1pZCI6IjBjYzQ1NzI5MmJkMjRkZjJhNWQ4ZTcwZGQyMWE4ZWUxIiwicHJvZHVjdC1pZCI6IlNwZWVjaFNlcnZpY2VzLkYwIiwiY29nbml0aXZlLXNlcnZpY2VzLWVuZHBvaW50IjoiaHR0cHM6Ly9hcGkuY29nbml0aXZlLm1pY3Jvc29mdC5jb20vaW50ZXJuYWwvdjEuMC8iLCJhenVyZS1yZXNvdXJjZS1pZCI6Ii9zdWJzY3JpcHRpb25zLzgxZmMzMDIyLWQ2MDgtNDM5OS05MmZmLTFkZjgyNDk4NmQwZS9yZXNvdXJjZUdyb3Vwcy90ZXN0L3Byb3ZpZGVycy9NaWNyb3NvZnQuQ29nbml0aXZlU2VydmljZXMvYWNjb3VudHMvc3BlZWNoVG9UZXh0Iiwic2NvcGUiOiJzcGVlY2hzZXJ2aWNlcyIsImF1ZCI6InVybjptcy5zcGVlY2hzZXJ2aWNlcy53ZXN0ZXVyb3BlIn0.QJuKyrkPQwbhd6ruWc4dmv5V5kV1FVzKmieXvjUq74w";

    // voci disponiibli
    // https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support

    this.creaAccessToken().subscribe(data => {
      const builder = require('xmlbuilder');

      console.log(data);
      const xml_body = builder.create('speak')
        .att('version', '1.0')
        .att('xml:lang', 'en-us')
        .ele('voice')
        .att('xml:lang', 'en-us')
        .att('name', 'Microsoft Server Speech Text to Speech Voice (en-US, Guy24KRUS)')
        .txt('select balance')
        .end();

      const body = xml_body.toString();
      let _headers: HttpHeaders = new HttpHeaders();
      _headers = _headers.append('Content-Type', 'application/ssml+xml');
      _headers = _headers.append('X-Microsoft-OutputFormat', 'riff-24khz-16bit-mono-pcm');
      _headers = _headers.append('cache-control', 'no-cache');
      _headers = _headers.append('Authorization', 'Bearer ' + data);

      this._http.post('https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1', body, { headers: _headers, responseType: 'blob' }).subscribe(blob => {
        const url = URL.createObjectURL(blob);
        // Get DOM elements.
        const audio = new Audio();
        audio.src = url;
        audio.load();
        audio.play().catch(function (error) {
          console.log(error.message);
        });
      });
    });
  }
}
