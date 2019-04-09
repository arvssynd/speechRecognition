import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpHeaders, HttpClient } from "@angular/common/http";

declare var require: any;

@Injectable()
export class TextToSpeechService {
    constructor(private http: HttpClient) { }
    initialize() { }
    start(textToSpeech: string) {
        this.getAccessToken().subscribe(data => {
            this.http.post('https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1'
                , this.getXmlBody(textToSpeech)
                , { headers: this.getHeaders(data), responseType: 'blob' })
                .subscribe(blob => {
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

    getAccessToken(): Observable<string> {
        let _headers: HttpHeaders = new HttpHeaders();
        _headers = _headers.append('Content-Type', 'application/json');
        _headers = _headers.append(
            'Ocp-Apim-Subscription-Key', '34503c2e2f2f42cd89e9db68cb3a6254'
        );

        return this.http.post('https://westeurope.api.cognitive.microsoft.com/sts/v1.0/issuetoken', '', { headers: _headers, responseType: 'text' }
        );
    }

    getXmlBody(text: string): string {
        const builder = require('xmlbuilder');
        const xml_body = builder.create('speak')
            .att('version', '1.0')
            .att('xml:lang', 'en-us')
            .ele('voice')
            .att('xml:lang', 'en-us')
            .att('name', 'Microsoft Server Speech Text to Speech Voice (en-US, Guy24KRUS)')
            .txt(text)
            .end();

        return xml_body.toString();
    }

    getHeaders(accessToken: string): HttpHeaders {
        return new HttpHeaders()
            .append('Content-Type', 'application/ssml+xml')
            .append('X-Microsoft-OutputFormat', 'riff-24khz-16bit-mono-pcm')
            .append('cache-control', 'no-cache')
            .append('Authorization', 'Bearer ' + accessToken);
    }

}
