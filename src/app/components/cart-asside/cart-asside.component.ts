import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ItemInterface } from 'src/app/models/item-interface';
import { ItemService } from '../../services/item.service';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-cart-asside',
  templateUrl: './cart-asside.component.html',
  styleUrls: ['./cart-asside.component.css']

})
export class CartAssideComponent implements OnInit, OnDestroy {

  @Input() bmostrar: boolean;
  @Output() mostarEmitter = new EventEmitter<any>();

  public displayPurchased: boolean = false;
  public displayLogin: boolean = false;
  public items: Array<ItemInterface>;
  public idItems: Array<string>;
  public n_TotalPrice: number = 0;

  public subscription: Subscription;
  public totalItems: number;

  constructor(public _itemService: ItemService) {
    this.items = [];
    this.items = _itemService.getItemsComprados();

    this.subscription = _itemService.getMessage().subscribe(message => {
      if (!isNullOrUndefined(message)) {
        //console.log("dentro de cart-asside",message);
        this.items = message.itemsComprados;
        this.totalItems = this.items.length;
        this.n_TotalPrice = 0;
        this.items.forEach(item => {
          if (item != null && item != undefined) {
            console.log("item:", item);
            
            this.n_TotalPrice += item.price;
            console.log("price:" + this.n_TotalPrice)
          }

        })

      }
    });

  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    // console.log("items :", this.items);
  }

  mostrar() {
    this.bmostrar = !this.bmostrar;
    this.mostarEmitter.emit({bmostrar:this.bmostrar});

  }

  MostrarLogin() {
    this.displayLogin = !this.displayLogin;

  }

  MostrarCheckout() {
    this.displayPurchased = !this.displayPurchased;
    this.scrollToDown();
  }
  scrollToDown() {
    window.scrollTo(0, 1000);


  }

  EmptyCart() {
    // console.log("dentro de EmptyCart");
    this._itemService.cleanCart();
    this.n_TotalPrice = 0;

  }

  EliminarItem(index) {
    //console.log("dentro de eliminar item");
    let item = this.items[index];
    // console.log("item seleccionado",item);

    if (!isNullOrUndefined(item)) {
      // console.log("No es nullo");
      this._itemService.deleteArticle(item);
    }
    else {
      //  console.log("es nulo");
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
