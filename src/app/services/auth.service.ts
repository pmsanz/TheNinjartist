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
export class AuthService implements OnDestroy {
  public url: string;
  public SESSION = new Subject<any>();
  public state: string;
  public token: string;
  public headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });
  public validateToken: any;


  constructor(private _http: HttpClient, private router: Router) {

    this.validateToken = function myTimer() {

      //console.log("timmerAuthService")
      let token = (isNullOrUndefined(localStorage.getItem("accessToken")) ? "" : localStorage.getItem("accessToken"));
      //console.log("token", token)
      if (token != "") {

        //console.log("dentro de deleteImage itemaService", this)
        let headers = new HttpHeaders()
          .set("Content-Type", "application/json")

        ////console.log("_http:",this._http)
        _http.get(Global.url + 'user/isLogin/' + token, { headers: headers, responseType: 'text' })
          .subscribe((res) => {
            let response = JSON.parse(res);
            if (response.status == "Error") {
              //console.log("esta vencida")
              this.state = "close";
            }
            else {
              //console.log("actualizo this.state a open")
              this.state = "open";
            }

            a.next({ state: this.state });


          }, error => {
            //console.log("error", error);
            this.state = "close";

            a.next({ state: this.state });
          });

      }
      else {
        this.state = "close";

        a.next({ state: this.state });
      }

    }

    this.url = Global.url;

    this.state = (isNullOrUndefined(localStorage.getItem("accessToken")) ? "close" : "open");
    var a = this.SESSION;

    //console.log("b",b);
    var myVar = setInterval(this.validateToken, 1440000, a);
    // var myVar = setInterval(this.pepe, 1000, a);

  }

  ngOnDestroy(): void {
    this.SESSION.unsubscribe();

  }

  loginuser(email: string, password: string): Observable<any> {

    //console.log("email",email,"password",password);
    // // let params = JSON.stringify(item);
    // let headers = new HttpHeaders().set("Content-Type", "application/json");
    // return this._http.post(this.url + 'items/create/', {}, { headers: headers, responseType: 'text' });

    const url_api = this.url + "user/login";
    return this._http
      .post<UserInterface>(
        url_api,
        { email, password },
        { headers: this.headers }
      )
      .pipe(map(data => data));
  }

  setUser(user: UserInterface): void {
    let user_string = JSON.stringify(user);
    localStorage.setItem("currentUser", user_string);
    //this.SESION.next({ state: "open" });
  }

  setToken(token): void {
    localStorage.setItem("accessToken", token);


    //console.log("setToken")
    //console.log("actualizo this.state a open")
    this.state = "open";
    this.SESSION.next({ state: this.state });
  }

  getToken() {
    //console.log("token: ",localStorage.getItem("accessToken"))

    return (isNullOrUndefined(localStorage.getItem("accessToken")) ? "" : localStorage.getItem("accessToken"));
  }

  getCurrentUser(): UserInterface {
    let user_string = localStorage.getItem("currentUser");
    if (!isNullOrUndefined(user_string)) {
      let user: UserInterface = JSON.parse(user_string);
      return user;
    } else {
      return null;
    }
  }

  logoutUser() {
    // let accessToken = localStorage.getItem("accessToken");
    // const url_api = this.url +`user/logout?access_token=${accessToken}`;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    //console.log("logOut");
    this.state = "close";
    this.SESSION.next({ state: this.state });
    return this.router.navigate(['/home']);
    // return this.htttp.post<UserInterface>(url_api, { headers: this.headers });
  }

  subscribeSession() {

    return this.SESSION.asObservable();

  }

  ifLoginHome() {

    if (this.isLoging()) {
      //si detecta el token toma como que esta logueado y redirige
      //console.log("actualizo this.state a open")
      this.state = "open";
      this.SESSION.next({ state: this.state });
      return this.router.navigate(['/home']);

      //console.log("tiene token",this.authService.getToken());
    }


  }


  ifNotLoginHome() {

    if (!this.isLoging()) {
      //si detecta el token toma como que esta logueado y redirige
      //console.log("dentro de ifNotLoginHome");
      this.state = "close";
      this.SESSION.next({ state: this.state });
      //return this.router.navigate(['/home']);
      //console.log("tiene token",this.authService.getToken());
    }


  }

  isLoging() {
    //console.log("dentro de isLogin(), this.state",this.state)
    this.validateToken();
    if (this.state == "open")
      return true;
    else
      return false;
  }


  // validateToken(): void {
  //  //console.log("dentro de validateToken")
  //   let token = this.getToken();
  //   //console.log("token", token)
  //   if (token != "") {

  //     //console.log("dentro de deleteImage itemaService", this)
  //     let headers = new HttpHeaders()
  //       .set("Content-Type", "application/json")

  //     ////console.log("_http:",this._http)
  //     this._http.get(this.url + 'user/isLogin/' + token, { headers: headers, responseType: 'text' })
  //       .subscribe((res) => {
  //         let response = JSON.parse(res);
  //         if (response.status == "Error") {
  //          //console.log("esta vencida")
  //           this.state = "close";
  //         }
  //         else {
  //          //console.log("actualizo this.state a open")
  //           this.state = "open";
  //         }

  //         this.SESSION.next({ state: this.state });


  //       }, error => {
  //        //console.log("error", error);
  //         this.state = "close";

  //         this.SESSION.next({ state: this.state });
  //       });

  //   }
  //   else {
  //     this.state = "close";

  //     this.SESSION.next({ state: this.state });
  //   }

  // }

  // verboseWithToken(param: any,service , requestFunction): Observable<any> {

  //   try {
  //    //console.log("servicio",service);
  //    //console.log("metodo",requestFunction)

  //     return service[requestFunction].call(service,param,this.getToken());

  //   } catch (error) {

  //    //console.log("error:", error);
  //     return error;
  //   }


  // }


}
