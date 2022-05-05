import { Injectable, OnDestroy } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { map } from "rxjs/operators";
import { isNullOrUndefined } from "util";
import { Router } from '@angular/router';

import { UserInterface } from "../models/user-interface";
import { Global } from './global';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: "root"
})
export class FeedService implements OnDestroy {
  public url: string;
  public feedItems = new Subject<any>();
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
    this.feedItems.unsubscribe();

  }

  getAllFeeds(): Observable<any> {

    console.log("trayendo todos los feeds");

    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this._http.get(this.url + 'feed/getAll', { headers: headers, responseType: 'text' });

  }

  getAllFeedsObservable(): Observable<any> {

    return this.feedItems.asObservable();
  }

  addCommentToFeed(commentID: string, feedID: string): Observable<any> {


    let params = { commentID: commentID, feedID: feedID }

    let headers = new HttpHeaders().set("Content-Type", "application/json");

    return this._http.post(this.url + 'feed/addComment/', params, { headers: headers, responseType: 'text' });

  }

  alertChanges() {

    //One shot timmer

    this.getAllFeeds().subscribe((items) => {
      let localItemList = items;

      let localSubscription = this.feedItems;

      var myVar = setInterval(function myTimer() {

        //    console.log("enviando la lista de usuarios", localItemList);
        localSubscription.next({ localItemList });
        clearInterval(myVar);

      }, 1000, localItemList, localSubscription);

    });

  }

}
