import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemInterface } from '../../models/item-interface';
import { Global } from '../../services/global'
// 

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input() itemMostrar: ItemInterface;
  @Output() mostrarModalEvent = new EventEmitter();

  public titulo: string;
  public image: string;
  public contenido: string;
  public url: string;
  public b_needMoreSpace = false;

  constructor() {
    this.url = Global.url + "items/getImage/";


  }

  ngOnInit(): void {

    this.b_needMoreSpace = this.needMoreSpace(this.itemMostrar.price);
  }

  activarModal(id) {
console.log("this.itemMostrar", this.itemMostrar)
    this.mostrarModalEvent.emit({ id: id });

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
    } else {
     
      return false;
    }


  }

}
