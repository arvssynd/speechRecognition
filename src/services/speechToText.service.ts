import { Injectable, Output, EventEmitter } from "@angular/core";
import { SpeechRecognizer, SpeechConfig, AudioConfig } from 'microsoft-cognitiveservices-speech-sdk';
import { ServiceHelper } from "src/helpers/service.helper";
import { Observable, Subscriber } from "rxjs";
import { VocalCommand, VocalAction } from "src/models/vocalCommandModel";
import { TextToSpeechService } from "./textToSpeech.service";

@Injectable()
export class SpeechToTextService {
    private recognizer: SpeechRecognizer;
    private isInitialized: boolean;
    private speechRecognizedObserver: Observable<string>;
    private speechRecognizedSubscriber: Subscriber<string>;
    private vocalCommand: VocalCommand;
    private vocalCommandPrev: VocalCommand;
    private vocalCommands: VocalCommand[];
    private intervalCommandId: number;
    private isStartCommandValid: boolean;
    private microphoneDisconnectedSound: boolean;
    private _audioNotification: HTMLAudioElement;

    constructor(private serviceHelper: ServiceHelper
        , private textToSpeechService: TextToSpeechService
    ) { }

    initialize() {
        this.vocalCommands = this.serviceHelper.getCommands();
        const speechConfig = SpeechConfig.fromSubscription(this.serviceHelper.settings.subscriptionKey, this.serviceHelper.settings.serviceRegion);
        speechConfig.speechRecognitionLanguage = this.serviceHelper.settings.language;
        const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
        this.recognizer = new SpeechRecognizer(speechConfig, audioConfig);
        this.microphoneDisconnectedSound = true;
    }

    start() {
        try {
            if (!this.isInitialized) {
                this.recognizer.startContinuousRecognitionAsync();
                this.isInitialized = true;

                this.speechRecognizedObserver = new Observable<string>((observer) => {
                    const _this = this;
                    this.speechRecognizedSubscriber = observer;
                    this.recognizer.recognized = function (s, e) {
                        _this.checkCommand(e.result.text.toLowerCase()
                            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''));
                    };
                });
            }
        } catch (error) {
            this.isInitialized = false;
        }
    }

    end() {
        try {
            if (this.isInitialized) {
                this.recognizer.stopContinuousRecognitionAsync();

                if (this.intervalCommandId) {
                    window.clearInterval(this.intervalCommandId);
                }

                console.log('speechToText - end');
                this.isInitialized = false;
            }
        } catch (error) {
            console.log(error, 'speechToText - end error');
            this.isInitialized = false;
        }
        if (this.speechRecognizedObserver) {
            this.speechRecognizedSubscriber.complete();
            this.speechRecognizedObserver = null;
            this.speechRecognizedSubscriber = null;
        }
    }

    speechRecognized(): Observable<string> {

        if (this.speechRecognizedObserver) {
            return this.speechRecognizedObserver;
        }

        throw 'service not started. call start method';
    }

    private checkCommand(textRecognized: string) {
        const _this = this;

        this.speechRecognizedSubscriber.next(textRecognized);

        this.vocalCommand = this.vocalCommands.find(x => textRecognized.indexOf(x.grammar) !== -1);

        if (this.vocalCommand) {
            this.vocalCommandPrev = null;
            if (this.vocalCommand.action === VocalAction.Start) {
                this.onMicrophoneStart();
                this.microphoneDisconnectedSound = true;

                if (this.intervalCommandId) {
                    window.clearInterval(this.intervalCommandId);
                }

                console.log('speechToText - command START');
                this.vocalCommand = null;
                this.isStartCommandValid = true;

                this.intervalCommandId = window.setInterval(function () {
                    this.listening = false;
                    if (_this.microphoneDisconnectedSound) {
                        _this.onMicrophoneClose();
                        _this.microphoneDisconnectedSound = false;
                        window.clearInterval();
                    }

                    console.log('fine ascolto');
                    _this.resetCommands();
                }, 10000);
            } else if (this.vocalCommand.action === VocalAction.Scroll) {
                const htmlToSelectScroll = document.querySelector('[ng-reflect-klass="mat-select-panel mat-primary"]');
                if (htmlToSelectScroll) {
                    if (this.vocalCommand.scrollAction) {
                        htmlToSelectScroll.scrollTop += 250;
                    } else {
                        htmlToSelectScroll.scrollTop -= 250;
                    }
                }
            } else if (this.isStartCommandValid) {
                this.vocalCommandPrev = this.vocalCommand;

                if (this.intervalCommandId) {
                    window.clearInterval(this.intervalCommandId);
                }

                console.log('SpeechTotext - command ', this.vocalCommand);
                const htmlElement = document.querySelector('[data-speech="' + this.vocalCommand.dataSpeech + '"]') as HTMLElement;

                console.log('textToSpeech - ', this.vocalCommand.actionDescription);
                switch (this.vocalCommand.action) {
                    case VocalAction.Text:
                        htmlElement.focus();
                        break;
                    case VocalAction.Button:
                        htmlElement.click();
                        break;
                    case VocalAction.Select:
                        htmlElement.click();
                        break;
                    default:
                        break;
                }

                if (this.vocalCommand.actionDescription) {
                    this.textToSpeechService.start(this.vocalCommand.actionDescription);
                }

                if (this.intervalCommandId) {
                    this.intervalCommandId = window.setInterval(function () {
                        if (_this.microphoneDisconnectedSound) {
                            _this.onMicrophoneClose();
                            _this.microphoneDisconnectedSound = false;
                        }

                        console.log('fine ascolto');
                        _this.resetCommands();
                    }, 10000);
                }
            }
        } else if (this.vocalCommandPrev) {
            const htmlElement = document.querySelector('[data-speech="' + this.vocalCommandPrev.dataSpeech + '"]');

            switch (this.vocalCommandPrev.action) {
                case VocalAction.Text:
                    (htmlElement as HTMLInputElement).value = textRecognized;
                    //this.changeDetector.detectChanges();
                    break;
                case VocalAction.Select:
                    textRecognized = this.speechToNumber(textRecognized, true);
                    const htmlToSelect = document.querySelector('[id="mat-option-' + textRecognized + '"]') as HTMLSelectElement;
                    htmlToSelect.click();
                    break;
                default:
                    break;
            }
            this.vocalCommandPrev = null;
        }

    }

    resetCommands() {
        this.isStartCommandValid = false;
        this.vocalCommand = null;
    }

    private onMicrophoneStart() {
        this.loadAudioNotification("microphone_connected.mp3");
    }

    private onMicrophoneClose() {
        this.loadAudioNotification("microphone_disconnected.mp3");
    }

    private loadAudioNotification(track: string): void {
        this._audioNotification = new Audio();
        this._audioNotification.src = "../assets/" + track;
        this._audioNotification.load();
        this._audioNotification.play();
    }

    private speechToNumber(text: string, forSelect: boolean = false): string {
        // verificare come lo legge in inglese
        if (text.indexOf("uno") !== -1) {
            if (forSelect) {
                return "0";
            } else {
                return "1";
            }
        }

        if (forSelect) {
            const textToNumber = +text;
            return (textToNumber - 1).toString();
        } else {
            return text;
        }
    }
}
