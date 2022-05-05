import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ItemInterface } from '../../models/item-interface';
import { ItemService } from '../../services/item.service';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { AuthService } from '../../services/auth.service'


@Component({
  selector: 'app-image-update',
  templateUrl: './image-update.component.html',
  styleUrls: ['./image-update.component.css']

})
export class ImageUpdateComponent implements OnInit, OnDestroy {

  @Output() action = new EventEmitter();
  itemList: Array<ItemInterface>;
  subscription: Subscription;
  constructor(public _itemService: ItemService, private _authService: AuthService) {
    this.itemList = [];
    this.itemList = _itemService._itemList;
    this.subscription = _itemService.getAllItemSecureSubscription().subscribe(message => {
      // console.log("XXXX-->> SUBSCRIPTION image-update",message);
      if (!isNullOrUndefined(message)) {

        this.itemList = message.items;
        console.log("!!!Subscripto a subscribirGetItems", this.itemList);
      }

    });

    this._itemService.getAllItemSecure();

  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {



  }



  modifyItem(item: ItemInterface) {
    this.itemList.forEach((itemL) => {
      if (itemL.id == item.id) {
        //console.log("item encontrado", itemL);
        // let item_blank:ItemInterface = {id:null};
        // this.action.emit({ item: item_blank });
        this.action.emit({ item: itemL });
      }
    });


  }

  deleteItem(id: string, titulo: string) {

    if (confirm("Are you sure to delete " + titulo + "?")) {
      this._itemService.deleteItem(id).subscribe(message => {
        if (!isNullOrUndefined(message)) {
          let mjson = JSON.parse(message);
          console.log("valor", mjson.mensaje);
          if (mjson.mensaje == "Token invalida") {
            console.log("token invalida", message);
            this._authService.logoutUser();
          }
          console.log("elemento eliminado correctamente", message);
          this._itemService.convertToItems();
          let empty: ItemInterface = {};
          this.action.emit({ item: empty });

        }

      }, err => {
        console.log("el error es este-->", err.error);
        let mjson = JSON.parse(err.error);
        console.log("valor", mjson.mensaje);
        if (mjson.mensaje == "Token no proveida.") {
          console.log("token invalida", err.error);
          this._authService.logoutUser();
        }

      });
    }

  }

  formatPriceDivision(price: number): number {
    let retVal = 0;
    retVal = price / 100;

    if (retVal > 1)
      return retVal;
    else
      return 0;
  }


}
