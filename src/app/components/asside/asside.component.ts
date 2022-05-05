import { Component, OnInit, Input, HostListener, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemService } from '../../services/item.service';
import { ItemInterface } from 'src/app/models/item-interface';
import { isNullOrUndefined } from 'util';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-asside',
  templateUrl: './asside.component.html',
  styleUrls: ['./asside.component.css']



})

export class AssideComponent implements OnInit, OnDestroy {

  @Output() _mostrarCart = new EventEmitter();

  public displayLogin: boolean;
  public displayPurchased: boolean;
  public notificationPurchased: number;
  private itemsComprados: Array<ItemInterface>;
  public bisLogin: boolean = false;
  public bbarsShow: boolean = false;

  subscription: Subscription;
  sessionSubscription: Subscription;


  constructor(private authService: AuthService, private messageService: ItemService) {

    this.itemsComprados = [];
    this.displayLogin = false;
    this.displayPurchased = false;
    this.notificationPurchased = 0;

    this.sessionSubscription = authService.subscribeSession().subscribe(message => {
      // console.log("XXXXX--> subscripto a la sesion :", message);
      // console.log("estado del autservice",authService.state)
      if (message.state == "open") {

        this.bisLogin = true;
        authService.state = "open";
      }
      else {
        this.bisLogin = false;
        authService.state = "close";
      }

    });;


    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (!isNullOrUndefined(message)) {
        // console.log("dentro de asside",message);
        this.itemsComprados = message.itemsComprados;
        // console.log("items comprados:" ,this.itemsComprados.length);
        this.notificationPurchased = this.itemsComprados.length;
      }

    });


  }


  ngOnInit(): void {
    this.messageService.recibirNovedades();

    //console.log("CONSTRUCTOR asside");
    if (this.authService.state == "open") {

      this.bisLogin = true;
    }



    //   this.messageService.getItemsByRest().subscribe(message => {

    //     if (!isNullOrUndefined(message)) {
    //      console.log("RECIBIENDO ITEMS!!!!!",message);
    //   }
    // });

  }



  logOut() {

    this.authService.logoutUser();
    this.bisLogin = false;
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
    this.sessionSubscription.unsubscribe();
  }

  mostrarUser() {
    this.displayPurchased = false;
    this.displayLogin = !this.displayLogin;


  }

  mostrarCheckOut() {
    this.displayLogin = false;
    this.displayPurchased = !this.displayPurchased;

  }

  mostrarCart() {

    this._mostrarCart.emit({ mostrar: true });
  }


  clickBars() {
    console.log("click in bars")
    this.bbarsShow = !this.bbarsShow;
  }


}
