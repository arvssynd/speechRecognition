import { Injectable } from "@angular/core";
import { Settings, VocalCommand, VocalAction } from "src/models/vocalCommandModel";

@Injectable()
export class ServiceHelper {
    private _settings: Settings;
    private _speechSettings: any;
    private _audioNotification: HTMLAudioElement;
    private commands: VocalCommand[];

    constructor() {
        this._settings = new Settings();
        this._settings.serviceRegion = "westeurope";
        this._settings.subscriptionKey = "32251671a2ee48e4b3764d4d209b6c83";
        this._settings.language = "it-IT";
    }

    get settings() {
        return this._settings;
    }

    public getCommands() {
        this.commands = [];
        let cmdToAdd: VocalCommand = {
            page: 'app',
            action: VocalAction.Start,
            grammar: 'ok evo',
            dataSpeech: 'vocal-recognition-start',
            actionDescription: null
        };

        this.commands.push(cmdToAdd);

        cmdToAdd = {
            page: 'app',
            action: VocalAction.Text,
            grammar: 'seleziona bilancia',
            dataSpeech: 'balanceselection',
            actionDescription: 'insert balance id'
        };

        this.commands.push(cmdToAdd);

        cmdToAdd = {
            page: 'app',
            action: VocalAction.Button,
            grammar: 'cerca',
            dataSpeech: 'find',
            actionDescription: null
        };

        this.commands.push(cmdToAdd);

        return this.commands;
    }

    onMicrophoneStart() {
        this.loadAudioNotification("microphone_connected.mp3");
    }

    onMicrophoneClose() {
        this.loadAudioNotification("microphone_disconnected.mp3");
    }

    private loadAudioNotification(track: string): void {
        this._audioNotification = new Audio();
        this._audioNotification.src = "../assets/" + track;
        this._audioNotification.load();
        this._audioNotification.play();
    }
}
