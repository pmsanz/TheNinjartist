import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { ItemInterface } from '../models/item-interface';
import { Subject, Observable, empty, Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { Global } from './global';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class ItemService implements OnDestroy, OnInit {
    public url: string;
    public subject_itemsComprados = new Subject<any>();
    public subject_items = new Subject<any>();

    public _itemList: Array<ItemInterface>;
    public itemsComprados: Array<ItemInterface>;
    public IditemsComprados: Array<string>;
    private headers: HttpHeaders;
    sessionSubscription: Subscription;
    public loadBarSubscription = new Subject<any>();
    public allItemsSubscription = new Subject<any>();
    private uploadedPercentage = 0;

    constructor(
        private _http: HttpClient, private _authService: AuthService
    ) {
        this.url = Global.url;
        this.itemsComprados = [];
        this.IditemsComprados = [];
        this._itemList = [];

        this.convertToItems();
        // console.log("Lista COMPLETA", this._itemList);


        if (!isNullOrUndefined(localStorage.getItem('cartItems'))) {
            //console.log("valor localStorage", localStorage.getItem('cartItems'));

            let json = JSON.parse(localStorage.getItem('cartItems'));

            console.log("json", json);

            for (let index = 0; index < json.length; index++) {
                const element = json[index];
                console.log("element", element);
                if (this.IditemsComprados.indexOf(element) == -1)
                    this.IditemsComprados.push(element);
            }

            this.cargarIdItemsComprados();



        }


        this.alertChanges();

        //console.log("b",b);


    }

    ngOnInit() {





    }

    alertChanges() {
        //One shot timmer

        let localSubscription = this.subject_items;

        this.getItemsByRest().subscribe((items) => {

            this._itemList = items;
            let localItemList = this._itemList;

            var myVar = setInterval(function myTimer() {

                console.log("enviando la lista de cursos", localItemList);
                localSubscription.next({ items: localItemList });
                clearInterval(myVar);

            }, 1000, localItemList, localSubscription);

        });

    }


    ngOnDestroy(): void {
        this.subject_items.unsubscribe();
        this.subject_itemsComprados.unsubscribe();

        if (this.loadBarSubscription != undefined)
            this.loadBarSubscription.unsubscribe();

        if (this.loadBarSubscription != undefined)
            this.allItemsSubscription.unsubscribe();

    }

    convertToItems() {

        this.getItemsByRest().subscribe(message => {

            if (!isNullOrUndefined(message)) {

                let coleccion = message;

                var coleccion_casted = coleccion.map(function (x) {
                    let _item: ItemInterface = {};
                    if (x._id != undefined)
                        _item.id = x._id;
                    else
                        _item.id = x.id;
                    _item.titulo = x.titulo;
                    _item.imagePreview = x.imagePreview;
                    _item.imageFull = x.imageFull;
                    _item.contenido = x.contenido;
                    _item.height = x.height;
                    _item.width = x.width;
                    _item.weight = x.weight
                    _item.price = x.price;

                    return _item;
                });


                //  console.log("---> Coleccion casteada:", coleccion_casted);
                this._itemList = coleccion_casted;
                // console.log("RECIEBIENDO DEL REST--> ", this._itemList);
                this.cargarIdItemsComprados();
                this.subject_items.next({ items: this._itemList });
            }
        });

    }

    cargarIdItemsComprados() {
        // //carga el carrito con los ids comprados
        //console.log("CARGANDO ITEMS COMPRADOS",this.IditemsComprados)
        this.itemsComprados = [];
        if (this._itemList.length > 0) {
            // console.log("ZZZZ---> Hay items",this.IditemsComprados)
            this.IditemsComprados.forEach(item => {
                //  console.log("item", item);
                let i = this.getItemById(item);
                this.itemsComprados.push(i);
            });

            console.log("this.itemsComprados", this.itemsComprados);
            this.subject_itemsComprados.next({ itemsComprados: this.itemsComprados });
        }

    }

    getItemsByRest(): Observable<any> {

        return this._http.get(this.url + 'items/getStore');
    }



    getItems(): Observable<any> {

        return this.subject_items.asObservable();
    }

    getItemsComprados() {
        return this.itemsComprados;
    }

    getItemById(message) {
        //console.log("dentro getItemById :", message, this._itemList);
        let item: ItemInterface;

        if (!isNullOrUndefined(message) && !isNullOrUndefined(this._itemList))
            item = this.buscarItembyId(message, this._itemList);

        //console.log("item encontrado getItemById",item,this._itemList);

        return item;
    }
    //cambiar titulo por id
    addArticle(message: string) {
        //Busco en el general
        let titulo = this.buscarItembyId(message, this._itemList);
        // console.log("encontrado en los titulos :", titulo);
        //busco en los items comprados
        let titulo_comprado = this.buscarItembyId(message, this.itemsComprados);
        // console.log("encontrado en los comprados :", titulo);
        if (!isNullOrUndefined(titulo) && isNullOrUndefined(titulo_comprado)) {
            //   console.log("agregando :" + titulo);
            this.itemsComprados.push(titulo);
            this.IditemsComprados = this.itemsComprados.map(item => { return item.id });
            localStorage.removeItem('cartItems');
            localStorage.setItem('cartItems', JSON.stringify(this.IditemsComprados));
            this.subject_itemsComprados.next({ itemsComprados: this.itemsComprados });
        }

    }

    deleteArticle(item: ItemInterface) {
        //console.log("deleteArticle",item);
        //console.log("array itemsComprados",this.itemsComprados);

        let itemsCompradosNew: Array<ItemInterface> = [];
        for (let index = 0; index < this.itemsComprados.length; index++) {


            if (item.id != this.itemsComprados[index].id) {
                itemsCompradosNew.push(this.itemsComprados[index]);
                //console.log("item",item,"no es igual a ",this.itemsComprados[index]);
            }
            else {
                // console.log("borrando...",this.itemsComprados[index]);

            }


        }

        this.itemsComprados = itemsCompradosNew;
        this.IditemsComprados =
            itemsCompradosNew.map(
                item => {
                    return item.id
                });
        console.log("this.IditemsComprados", this.IditemsComprados);
        localStorage.removeItem('cartItems');
        localStorage.setItem('cartItems', JSON.stringify(this.IditemsComprados));
        this.subject_itemsComprados.next({ itemsComprados: this.itemsComprados });
    }

    recibirNovedades() {

        if (isNullOrUndefined(this.itemsComprados)) {
            this.itemsComprados = [];
            this.itemsComprados.length = 0;
            this.subject_itemsComprados.next({ itemsComprados: this.itemsComprados });
        }
        else {
            this.subject_itemsComprados.next({ itemsComprados: this.itemsComprados });
        }

    }

    cleanCart() {
        this.itemsComprados.length = 0;
        localStorage.removeItem('cartItems');
        this.subject_itemsComprados.next({ itemsComprados: this.itemsComprados });
    }

    getMessage(): Observable<any> {
        return this.subject_itemsComprados.asObservable();
    }

    buscarItembyId(id: string, itemList: Array<ItemInterface>) {

        console.log("dentro de BuscarItem", id, itemList);
        for (let index = 0; index < itemList.length; index++) {

            if (itemList[index].id == id)
                return itemList[index];


        }
        return null;


    }

    buscarComprados(id: string) {
        //busca el titulo dentro de los comprados
        let titulo_comprado: ItemInterface;
        // console.log("dentro de buscar comprados", id);
        if (!isNullOrUndefined(id) && !isNullOrUndefined(this.itemsComprados)) {
            titulo_comprado = this.buscarItembyId(id, this.itemsComprados);
        }

        if (isNullOrUndefined(titulo_comprado))
            return true;
        else
            return false;

    }

    // API REST ITEMS



    createItem(item: ItemInterface): Observable<any> {

        let params = JSON.stringify(item);
        let headers = new HttpHeaders().set("Content-Type", "application/json").set("authorization", this._authService.getToken());
        return this._http.post(this.url + 'items/create/', params, { headers: headers, responseType: 'text' });

    }

    deleteItem(id: string): Observable<any> {

        let response: Observable<any>;
        let params_crud = { id: id };
        let params = JSON.stringify(params_crud);
        console.log("params", params);
        //let headers = new HttpHeaders().set("Content-Type", "application/json");
        let headers = new HttpHeaders()
            .set("Content-Type", "application/json")
            .set("authorization", this._authService.getToken());

        response = this._http.post(this.url + 'items/delete/' + id, params, { headers: headers, responseType: 'text' });
        // this.getItemsByRest();
        // this.convertToItems();
        console.log("Cantidad de items antes de actualiza", this._itemList.length);

        return response;
    }

    updateItem(item: ItemInterface): Observable<any> {

        console.log("itemservice, dentro de updateItem", item);
        let params = JSON.stringify(item);
        //let headers = new HttpHeaders().set("Content-Type", "application/json");
        let headers = new HttpHeaders()
            .set("Content-Type", "application/json")
            .set("authorization", this._authService.getToken());
        console.log("headers", headers);
        return this._http.post(this.url + 'items/update/' + item.id, params, { headers: headers, responseType: 'text' });

    }

    deleteImage(image: string, token: string): Observable<any> {

        //let headers = new HttpHeaders().set("Content-Type", "application/json");
        console.log("dentro de deleteImage itemaService", this)
        let headers = new HttpHeaders()
            .set("Content-Type", "application/json")
            .set("authorization", token);
        return this._http.post(this.url + 'items/deleteImage/' + image, { headers: headers, responseType: 'text' });

    }

    getItemSecure(id: string) {

        //console.log("dentro de deleteImage itemaService",this)
        let headers = new HttpHeaders()
            .set("Content-Type", "application/json")
            .set("authorization", this._authService.getToken());
        return this._http.get(this.url + 'items/getSecure/' + id, { headers: headers, responseType: 'text' });



    }

    getAllItemSecure() {

        //console.log("dentro de deleteImage itemaService",this)
        let headers = new HttpHeaders()
            .set("Content-Type", "application/json")
            .set("authorization", this._authService.getToken());
        this._http.get(this.url + 'items/getSecure/', { headers: headers, responseType: 'text' })
            .subscribe(message => {
                if (!isNullOrUndefined(message)) {

                    let jsonObject: any = JSON.parse(message)
                    let items_casted: Array<ItemInterface> = jsonObject.items;
                    this.allItemsSubscription.next({ items: items_casted });

                }
            });

    }

    getAllItemSecureSubscription(): Observable<any> {

        return this.allItemsSubscription.asObservable();
    }

    getLoadBarSubscription(): Observable<any> {

        return this.loadBarSubscription.asObservable();
    }

    createNew(formData: FormData) {
        //VIEJO
        // const endpoint = this.url + "contenido/createVideo"
        // console.log("dentro de update/contenido")
        // //const formData: FormData = new FormData();
        // return this._http.post(endpoint, formData);

        //AHORA
        const endpoint = this.url + "items/createNew"

        this._http.post(endpoint, formData, {
            reportProgress: true, observe: 'events'
        }).subscribe((event: HttpEvent<any>) => {
            switch (event.type) {
                case HttpEventType.Sent:
                    this.loadBarSubscription.next({ state: 'start', value: 0 });
                    //console.log("SENT")
                    // this.slimLoadingBarService.start();
                    break;
                case HttpEventType.Response:
                    this.loadBarSubscription.next({ state: 'completed', value: 100, duracion: event.body.duracion });
                    //console.log("response")
                    // this.slimLoadingBarService.complete();
                    // this.message = "Uploaded Successfully";
                    // this.showMessage = true;
                    break;
                case 1: {
                    if (Math.round(this.uploadedPercentage) !== Math.round(event['loaded'] / event['total'] * 100)) {
                        this.uploadedPercentage = event['loaded'] / event['total'] * 100;
                        this.loadBarSubscription.next({ state: 'inProgress', value: Math.round(this.uploadedPercentage) });
                        //console.log("PROGRESS", Math.round(this.uploadedPercentage))
                        //   this.slimLoadingBarService.progress = Math.round(this.uploadedPercentage);
                    }
                    break;
                }
            }
        },
            error => {
                //console.log("Catcheando el error", error);
                this.loadBarSubscription.next({ state: 'error', value: -1 });
            });

    }


}

