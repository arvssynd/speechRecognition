import { Component, OnInit } from '@angular/core';
import { SpeechToTextService } from 'src/services/speechToText.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material';

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

  // manageSpeechRecognition(ev: MatSlideToggleChange) {
  //   // if (!ev.checked) {
  //   //   this.speechToTextService.end();
  //   // } else if (ev.checked) {
  //   //   console.log('aaaa');
  //   //   this.speechToTextService.start();
  //   //   this.speechToTextService.speechRecognized().subscribe(data => {
  //   //     console.log(data);
  //   //   }, err => {
  //   //     console.log(err);
  //   //   });
  //   // }
  // }

  cerca() {
    alert('cerca');
  }
}
