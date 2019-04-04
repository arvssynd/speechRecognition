import { Injectable } from "@angular/core";
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
    private vocalCommands: VocalCommand[];
    private intervalCommandId: number;
    private isStartCommandValid: boolean;
    private microphoneDisconnectedSound: boolean;

    constructor(private serviceHelper: ServiceHelper
        , private textToSpeechService: TextToSpeechService) { }

    initialize() {
        this.microphoneDisconnectedSound = true;

        this.vocalCommands = this.serviceHelper.getCommands();

        const speechConfig = SpeechConfig.fromSubscription(this.serviceHelper.settings.subscriptionKey, this.serviceHelper.settings.serviceRegion);
        speechConfig.speechRecognitionLanguage = this.serviceHelper.settings.language;
        const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
        this.recognizer = new SpeechRecognizer(speechConfig, audioConfig);
        console.log('1');
    }

    start() {
        try {
            console.log('2');
            if (!this.isInitialized) {
                console.log('3');
                this.recognizer.startContinuousRecognitionAsync();
                this.isInitialized = true;

                this.speechRecognizedObserver = new Observable<string>((observer) => {
                    const _this = this;
                    this.speechRecognizedSubscriber = observer;
                    console.log(observer);
                    this.recognizer.recognized = function (s, e) {
                        console.log(e);
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
            if (this.vocalCommand.action === VocalAction.Start) {
                this.serviceHelper.onMicrophoneStart();
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
                        _this.serviceHelper.onMicrophoneClose();
                        _this.microphoneDisconnectedSound = false;
                    }

                    console.log(_this.intervalCommandId);
                    console.log(_this.microphoneDisconnectedSound);
                    console.log('fine ascolto');
                    _this.resetCommands();
                }, 10000);
            } else if (this.isStartCommandValid) {
                if (this.intervalCommandId) {
                    window.clearInterval(this.intervalCommandId);
                }

                console.log('SpeechTotext - command ', this.vocalCommand);
                const htmlElement = document.querySelector('[data-speech="' + this.vocalCommand.dataSpeech + '"]') as HTMLElement;

                switch (this.vocalCommand.action) {
                    case VocalAction.Text:
                        htmlElement.focus();
                        console.log('textToSpeech - ', this.vocalCommand.actionDescription);
                        break;
                    case VocalAction.Button:
                        htmlElement.click();
                        console.log('textToSpeech - ', this.vocalCommand.actionDescription);
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
                            _this.serviceHelper.onMicrophoneClose();
                            _this.microphoneDisconnectedSound = false;
                        }
                        console.log('fine ascolto');
                        _this.resetCommands();
                    }, 10000);
                }
            }
        }
    }

    resetCommands() {
        this.isStartCommandValid = false;
        this.vocalCommand = null;
    }
}
