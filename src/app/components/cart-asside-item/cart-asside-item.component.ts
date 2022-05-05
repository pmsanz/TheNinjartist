import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { ItemInterface } from 'src/app/models/item-interface';
import {Global} from '../../services/global';

@Component({
  selector: 'app-cart-asside-item',
  templateUrl: './cart-asside-item.component.html',
  styleUrls: ['./cart-asside-item.component.css']
})
export class CartAssideItemComponent implements OnInit {
@Input() itemMostrar:ItemInterface;
// @Input() image:string;
@Output() eliminaItemEvent = new EventEmitter;
public b_needMoreSpace = false;

public url:string = Global.emptyImageUrl;
  constructor() {
 
    this.url = Global.url + Global.method;
    // this.itemMostrar.imagePreview = Global.emptyImageUrl;
    // console.log("image",this.image)
    // console.log("titulo",this.titulo)
   }

  ngOnInit(): void {
    this.b_needMoreSpace = this.needMoreSpace(this.itemMostrar.price);
  }

  formatPriceDivision(price: number): number {

    let retVal = 0;
    retVal = price / 100;

    if (retVal > 1)
      return retVal;
    else
      return 0;
  }

  needMoreSpace(price: number): boolean {

    let retVal = 0;
    retVal = price / 100;

    if (retVal.toString().length > 1) {
      return true;
    } else
      return false;

  }


}
