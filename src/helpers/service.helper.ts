import { Injectable } from "@angular/core";
import { Settings, VocalCommand, VocalAction } from "src/models/vocalCommandModel";

@Injectable()
export class ServiceHelper {
    private _settings: Settings;
    private commands: VocalCommand[];

    constructor() {
        this._settings = new Settings();
        this._settings.serviceRegion = "westeurope";
        this._settings.subscriptionKey = "34503c2e2f2f42cd89e9db68cb3a6254";
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
            grammar: 'ok',
            dataSpeech: 'vocal-recognition-start',
            actionDescription: null
        };

        this.commands.push(cmdToAdd);

        cmdToAdd = {
            page: 'app',
            action: VocalAction.Text,
            grammar: 'seleziona',
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

        cmdToAdd = {
            page: 'app',
            action: VocalAction.Select,
            grammar: 'espandi',
            dataSpeech: 'selectOption',
            actionDescription: null
        };

        this.commands.push(cmdToAdd);

        cmdToAdd = {
            page: 'app',
            action: VocalAction.Scroll,
            scrollAction: false,
            grammar: 'su',
            dataSpeech: '',
            actionDescription: null
        };

        this.commands.push(cmdToAdd);

        cmdToAdd = {
            page: 'app',
            action: VocalAction.Scroll,
            scrollAction: true,
            grammar: 'giù',
            dataSpeech: '',
            actionDescription: null
        };

        this.commands.push(cmdToAdd);

        return this.commands;
    }
}
