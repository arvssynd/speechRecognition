import { Component, OnInit } from '@angular/core';
import { SpeechToTextService } from 'src/services/speechToText.service';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public checked: boolean;
  private selectBox: any[] = [];
  public pippo: any;

  constructor(private speechToTextService: SpeechToTextService) {
  }

  ngOnInit(): void {
    this.checked = false;
    this.selectBox.push({ key: 'peso1_val', value: 'peso1_val' }, { key: 'peso2_val', value: 'peso2_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' }, { key: 'peso3_val', value: 'peso3_val' });
  }

  manageSpeechRecognition(ev: MatSlideToggleChange) {
    this.checked = ev.checked;
    if (!this.checked) {
      this.speechToTextService.end();
    } else if (this.checked) {
      this.speechToTextService.initialize();
      this.speechToTextService.start();
      this.speechToTextService.speechRecognized().subscribe(data => {
        console.log(data);
      }, err => {
        console.log(err);
      });
    }
  }

  cerca() {
    alert('cerca');
  }

  getMediaAudioDevices() {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos: MediaDeviceInfo[]) => {
      const audioDevices = deviceInfos.filter(x => x.kind === 'audioinput');
      if (audioDevices.length <= 0) {
        console.log('microphones not found');
      }
      console.log(audioDevices);
    });
  }

  ciao() {
    console.log(this.pippo);
  }

  checkbox(textRecognized: string) {
    const htmlToCheck = document.querySelector('[data-speech="' + textRecognized + '"]') as HTMLElement;
    // const htmlToCheck = document.querySelector('[class="mat-radio-label"]') as HTMLElement;

    // htmlToCheck.click();
    if (htmlToCheck.hasChildNodes) {
      (htmlToCheck.firstChild as HTMLElement).click();
    }

    // htmlToCheck.dispatchEvent(new Event('input'));
  }
}
