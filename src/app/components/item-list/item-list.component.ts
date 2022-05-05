import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ItemInterface } from '../../models/item-interface';
import { isNullOrUndefined } from 'util';
import { Subscription } from 'rxjs';
import { PurchaseService } from 'src/app/services/purchase.service';

declare var $: any;
@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']

})
export class ItemListComponent implements OnInit, OnDestroy {


  public items: Array<ItemInterface>;
  public itemSelected: ItemInterface;
  public showItem: boolean;
  public value: number;
  public itemExist: boolean;

  subscription: Subscription;
 
  constructor(
    private _ItemService: ItemService
  ) {


    this.itemExist = false;
    this.items = [];
    this.showItem = false;
    this.value = 16;

    this.items = _ItemService._itemList;

    this.itemExist = true;
    this.itemSelected = {};


  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    //console.log("!!!En oninit",this._ItemService);

    

    // this._PurchaseService.showLoadCircle();

    this.subscription = this._ItemService.getItems().subscribe(message => {
      if (!isNullOrUndefined(message) && message.items.length > 0) {
        //console.log("!!!Subscripto a getITEMS", message);
        this.items = message.items;
      }

    });



  }

  mostrarModal(evento) {
    //console.log("mostrarModal(evento)",evento.id);
    this.itemSelected = this._ItemService.buscarItembyId(evento.id, this.items);


    //console.log("this.itemSelected",this.itemSelected);
    $("#exampleModal").modal('show');
    //console.log("Desde ItemList: " + evento.id);

  }

  mostrarItem() {

    //this.items = this.items.slice(3, 6);
    this.value = this.value + 16;
    // if (this.value > this.items.length) {
    //   this.value = this.items.length + 1;
    // }

  }




}
