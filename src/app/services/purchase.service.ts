import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Global } from './global';
import { Observable, Subject } from 'rxjs';
import { ItemInterface } from '../models/item-interface';


@Injectable({ providedIn: 'root' })
export class PurchaseService implements OnDestroy {
    public url: string;
    public subscriptionLoadingCircle = new Subject<any>();

    constructor(private _http: HttpClient) {
        this.url = Global.url;
    }
    ngOnDestroy(): void {
        if (this.subscriptionLoadingCircle != null)
            this.subscriptionLoadingCircle.unsubscribe();
    }


    downloadById(id: string): Observable<any> {

        console.log("obtener items de ", id);
        //let mail = { subject: subject, cuerpoMail: bodyMail };

        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this._http.post(this.url + 'purchase/download/' + id, { headers: headers, responseType: 'text' });

    }

    getSubscriptionLoadCircle() {
        return this.subscriptionLoadingCircle.asObservable();
    }

    showLoadCircle() {
        this.subscriptionLoadingCircle.next({ state: 'show' });

        let localSubscription = this.subscriptionLoadingCircle;

        var myVar = setInterval(function myTimer() {

            localSubscription.next({ state: 'hide' });
            clearInterval(myVar);

        }, 15000, localSubscription);

    }

    hideLoadCircle() {
        this.subscriptionLoadingCircle.next({ state: 'hide' });
    }

    downloadByOrderId(orderId: string): Observable<any> {

        console.log("obtener items de orderId:  ", orderId);
        //let mail = { subject: subject, cuerpoMail: bodyMail };
        let params = { orderId: orderId };
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this._http.post(this.url + 'purchase/downloadByOrderId/', params, { headers: headers, responseType: 'text' });

    }

    verificarCouponCode(email: string, coupon: string): Observable<any> {

        console.log("verificando si trae correctamente coupon", coupon, " del usuario:", email);
        let params = { email: email, coupon: coupon };

        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this._http.post(this.url + 'purchase/verificarCoupon/', params, { headers: headers, responseType: 'text' });

    }
    verificarCouponCodeNew(coupon: string): Observable<any> {

        console.log("verificando si trae correctamente coupon", coupon);
        let params = { coupon: coupon };

        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this._http.post(this.url + 'coupon/verificarCoupon/', params, { headers: headers, responseType: 'text' });

    }
    asociarCompra(purchaseId: String, items: Array<ItemInterface>): Observable<any> {

        console.log("verificando si trae correctamente purchaseId", items, " items array:", items);
        let params = { purchaseId: purchaseId, items: JSON.stringify(items) };

        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this._http.post(this.url + 'purchase/asociarCompra', params, { headers: headers, responseType: 'text' });

    }
    crearCompra(userName: String, coupon: String, items: Array<String>): Observable<any> {

        console.log("creando compra userName,coupon, items: " + userName + coupon + JSON.stringify(items));
        let params = {
            coupon: coupon,
            userName: userName,
            items: JSON.stringify(items)
        };

        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this._http.post(this.url + 'purchase/crearCompra', params, { headers: headers, responseType: 'text' });

    }
    setAproved(orderId: String, payerId: String): Observable<any> {

        console.log("Seteando en aprobado el orderId: " + orderId + " con payerID: " + payerId);
        let params = { orderId: orderId, payerId: payerId };

        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this._http.post(this.url + 'purchase/setAprove', params, { headers: headers, responseType: 'text' });

    }
    captureOrder(orderId: String): Observable<any> {

        console.log("capturando orden: " + orderId);
        let params = { orderId: orderId };

        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this._http.post(this.url + 'purchase/captureOrder', params, { headers: headers, responseType: 'text' });

    }


}



// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Subject, Observable, empty } from 'rxjs';
// import { Global } from './global';

// @Injectable({ providedIn: 'root' })
// export class PurchaseService {

//     public url: string;
//     constructor(
//         private _http: HttpClient
//     ) {
//         this.url = Global.url;

//     }

//     downloadById(id: string): Observable<any> {

//         console.log("obtener items de ", id);
//         //let mail = { subject: subject, cuerpoMail: bodyMail };

//         let headers = new HttpHeaders().set("Content-Type", "application/json");
//         return this._http.post(this.url + 'purchase/download/'+id,  { headers: headers, responseType: 'text' });

//     }

//     verificarCouponCode(coupon: string,email:string): Observable<any> {

//         console.log("verificando si trae correctamente coupon",coupon," del usuario:",email);
//         let body = { email: email, coupon: coupon };

//         let headers = new HttpHeaders().set("Content-Type", "application/json");
//         return this._http.post(this.url + 'purchase/verificarCoupon/',  { headers: headers, body:body, responseType: 'text' });

//     }

// }