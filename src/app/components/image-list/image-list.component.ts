import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemInterface } from 'src/app/models/item-interface';
import {AuthService} from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit,OnDestroy {

  public item: ItemInterface;
private subscription: Subscription;
  
  constructor(private _authService: AuthService,private router: Router) {
    this.item = {};
    //this.id = "pepeGrillo";
    _authService.ifNotLoginHome();
    
    this.subscription = _authService.subscribeSession().subscribe(message => {
      //console.log("message",message);
      if (!isNullOrUndefined(message)) {
        //console.log("dentro de cart-asside",message);
       if(message.state=="close"){
         //console.log("message",message);
         
         return this.router.navigate(['/home']);
       }
      }
    });



  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  getAction(evento) {
    console.log("dentro del evento", evento);
    let item_blank :ItemInterface = {id:null};
    this.item = item_blank;
    this.item = evento.item;
    //console.log("this.id", this.item.id);
  }

}
