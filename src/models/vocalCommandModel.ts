export class VocalCommand {
    page: string;
    dataSpeech: string;
    grammar: string;
    action: VocalAction;
    actionDescription: string;
}

export enum VocalAction {
    Start,
    Text,
    Button
}

export class Settings {
    subscriptionKey: string;
    serviceRegion: string;
    language: string;
}