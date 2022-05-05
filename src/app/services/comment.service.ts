import { Injectable, OnDestroy } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import { isNullOrUndefined } from "util";
import { Router } from '@angular/router';

import { UserInterface } from "../models/user-interface";
import { Global } from './global';
import { Subject } from 'rxjs';
import { CommentInterface } from "../models/comment";
@Injectable({
  providedIn: "root"
})
export class CommentService implements OnDestroy {
  public url: string;
  public SESSION = new Subject<any>();
  public state: string;
  public token: string;
  public headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });
  public validateToken: any;


  constructor(private _http: HttpClient) {
    this.url = Global.url;
  }

  ngOnDestroy(): void {
    this.SESSION.unsubscribe();

  }

  createComment(comment: CommentInterface): Observable<any> {

    let params = JSON.stringify(comment);

    let headers = new HttpHeaders().set("Content-Type", "application/json");

    return this._http.post(this.url + 'comment/create/', params, { headers: headers, responseType: 'text' });

  }

  reportComment(commentID: string, commentMessage: string): Observable<any> {

    let params = { commentID: commentID, commentMessage: commentMessage };

    let headers = new HttpHeaders().set("Content-Type", "application/json");

    return this._http.post(this.url + 'comment/report/', params, { headers: headers, responseType: 'text' });

  }

}
