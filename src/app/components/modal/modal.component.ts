import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ItemInterface } from '../../models/item-interface';
import { ItemService } from '../../services/item.service';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { Global } from '../../services/global';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']

})
export class ModalComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  tituloComprado: Boolean;
  public url: string;
  @Input() item: ItemInterface;

  constructor(private _itemService: ItemService) {
    this.url = Global.url + Global.method;
    
    //    console.log("Modal-Constructor");
    this.tituloComprado = false;
    //console.log("Modal-Item-constructor", this.item);
    if (isNullOrUndefined(this.item)) {
      this.item = {};
      
    }

    this.subscription = _itemService.getMessage().subscribe(message => {
      if (message) {

        //console.log("Modal- ngOnChanges - subscripcion ", message);
        this.tituloComprado = _itemService.buscarComprados(this.item.id);

      }

    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  clearCart(): void {
    // clear messages
    this._itemService.cleanCart();
  }

  ngOnChanges(): void {

    //console.log("Modal- ngOnChanges, valor item: ", this.item);
    if (!isNullOrUndefined(this.item)) {
      this.tituloComprado = this._itemService.buscarComprados(this.item.id);
    }
    //  console.log("Modal- ngOnChanges - this.tituloComprado",this.tituloComprado,"this.item.titulo:",this.item.titulo);
    //   this.subscription = this._itemService.getMessage().subscribe(message => {
    //     if (message) {

    //     //  console.log("Modal- ngOnChanges - subscripcion ",message);
    //       this.tituloComprado  = this._itemService.buscarComprados(this.item.id);

    //     }

    // });

  }

  ngOnInit(): void {

    if (!isNullOrUndefined(this.item))
      this.tituloComprado = this._itemService.buscarComprados(this.item.id);
    
    console.log("Modal - this.tituloComprado",this.tituloComprado,"this.item.titulo:",this.item.titulo);
    this.subscription = this._itemService.getMessage().subscribe(message => {
      if (message) {

        // console.log("Modal- subscripcion ",message);
        this.tituloComprado = this._itemService.buscarComprados(this.item.id);

      }

    });

  }

  comprar() {

       console.log("dentro de comprar",this.item);
    // send message to subscribers via observable subject
    this._itemService.addArticle(this.item.id);

  }

  quitarArticulo() {

    console.log("dentro de quitarArticulo");
    // send message to subscribers via observable subject
    this._itemService.deleteArticle(this.item);

  }



}



