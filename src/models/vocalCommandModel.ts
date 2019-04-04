export class VocalCommand {
    page: string;
    dataSpeech: string;
    grammar: string;
    action: VocalAction;
    scrollAction?: boolean;
    actionDescription: string;
}

export enum VocalAction {
    Start,
    Text,
    Button,
    Select,
    Scroll
}

export class Settings {
    subscriptionKey: string;
    serviceRegion: string;
    language: string;
}