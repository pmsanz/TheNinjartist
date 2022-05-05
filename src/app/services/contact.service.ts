import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Subject, Observable, empty } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { Global } from './global';


@Injectable({ providedIn: 'root' })
export class ContactService {

    public url: string;

    constructor(
        private _http: HttpClient
    ) {
        this.url = Global.url;

    }


    enviarMail(subject: string, bodyMail: string): Observable<any> {

        console.log("Enviando mail con los siguientes datos:", subject, bodyMail);
        let mail = { subject: subject, cuerpoMail: bodyMail };

        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this._http.post(this.url + 'user/enviarMail/', mail, { headers: headers, responseType: 'text' });

    }
}