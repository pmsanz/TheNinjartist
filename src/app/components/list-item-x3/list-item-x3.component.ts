import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {ItemInterface} from '../../models/item-interface';

@Component({
  selector: 'app-list-item-x3',
  templateUrl: './list-item-x3.component.html',
  styleUrls: ['./list-item-x3.component.css']
})
export class ListItemX3Component implements OnInit {

  @Input() itemMostrar:Array<ItemInterface>;
  @Output() mostrarModalEvent = new EventEmitter();

  constructor(
    
  ) {

    

   }

  ngOnInit(): void {

   
    
  }

  mostrarModal(evento){
    //console.log("itemX3 salto");
this.mostrarModalEvent.emit({id:evento.id});


  }

}
