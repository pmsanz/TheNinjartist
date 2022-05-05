import { Component, OnInit, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ItemService } from '../../services/item.service';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { ItemInterface } from 'src/app/models/item-interface';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']

})
export class CheckoutComponent implements OnInit, OnDestroy {

  public message: any;
  public subscription: Subscription;
  public totalInCart: Array<ItemInterface>;
  public messageError: string;
  public ShowMessageError: boolean;
  public isChecked: boolean = false;

  @Output() emptyCart = new EventEmitter();

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, public _purchaseService: PurchaseService, public _itemService: ItemService) {
    this.messageError = "";
    this.ShowMessageError = false;

    this.message = {

      userMail: "",
      codeCoupon: "",
      error: ""

    }
    this.message.error = "";



  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.message = {

      userMail: "",
      codeCoupon: "",
      error: ""

    }
  }


  cancelPurchase() {

    alert("You cancel your Purchased!!");
  }

  onSubmit() {

    //alert("congrats !" + this.message.userMail + " code coupon:" + this.message.codeCoupon);
    this._purchaseService.showLoadCircle();
    if (this.isChecked) {
      //tiene coupon , verifica y si es valido realiza compra

      console.log("valor coupon: " + this.message.codeCoupon)
      this._purchaseService.verificarCouponCodeNew(this.message.codeCoupon)
        .subscribe(message => {

          let response = JSON.parse(message);

          let verificado = response.state;
          console.log("recibiendo status del coupon:", verificado);
          if (verificado == "valid") {
            //realizo la compra con el coupon
            this.ShowMessageError = false;
            this.totalInCart = this._itemService.getItemsComprados();
            console.log("valores:", this.message.userMail, this.totalInCart, this.message.codeCoupon);
            this.crearPurchase(this.message.userMail, this.totalInCart, this.message.codeCoupon);
          }
          else {
            this.message.error = "Invalid Coupon code";
            this.ShowMessageError = true;
            this._purchaseService.hideLoadCircle();
          }

        }, error => {
          console.log("error validating coupon")
          this.message.error = "Invalid Coupon code";
          this.ShowMessageError = true;
          this._purchaseService.hideLoadCircle();
        });



      //muestro mensaje de error diciendo que el cuopon no es valido y bloqueo

    }
    else {
      //si no tiene coupon , realiza la compra directamente
      this.totalInCart = this._itemService.getItemsComprados();
      console.log("valores:", this.message.userMail, this.totalInCart, this.message.codeCoupon);
      this.crearPurchase(this.message.userMail, this.totalInCart, this.message.codeCoupon);

    }
    // this.subscription = this._purchaseService.verificarCouponCode(this.message.userMail, this.message.codeCoupon)
    //   .subscribe(message => {
    //     let purchase = JSON.parse(message)[0];
    //     console.log("dentro de checkout", message);
    //     if (!isNullOrUndefined(purchase)) {

    //       if (Array.isArray(purchase.items)) {
    //         if (purchase.items.length == purchase.items.totalImages) {
    //           //redirijo porque ya tiene la compra
    //           this.emptyCart.emit({});
    //           //this.router.navigate(['/download'], { queryParams: { id: purchase._id } });
    //         }
    //       } else {
    //         console.log("purchase.items no es array", purchase.items);

    //       }


    //     if (this.checkTotalImages(purchase)) {
    //       //si es valido , asocio la compra 
    //       this.AsociarPurchase(purchase._id, this.totalInCart);

    //     }


    //   }
    // });

  }

  crearPurchase(userEmail: string, items: Array<ItemInterface>, coupon: string = "") {

    if (Array.isArray(items) && items.length > 0) {

      let myItems = items.map((x) => {
        let id: string = x.id;
        return id;
      });

      this._purchaseService.crearCompra(userEmail, coupon, myItems).subscribe(data => {
        let response = JSON.parse(data);
        console.log("resultado de crearCompra: " + response.status);
        if (response.status == "success") {
          this._purchaseService.hideLoadCircle();
          console.log("success, redirigiendo!", response.url);
          this.document.location.href = response.url;
          // this.router.navigate(response.url, { queryParams: {} });

        }else{
          this._purchaseService.hideLoadCircle();
        }

        

      }, error => {

        console.log("error", error);
        this.message.userEmail = ".";
        this.message.userEmail = "";

      })

    }


  }

  verificarCoupon(coupon: string) {


    this._purchaseService.verificarCouponCodeNew(this.message.userMail)
      .subscribe(message => {

        let verificado = message.verificado;

        if (verificado)
          return true;
        else
          return false;

      }, error => {
        return false;
      });

  }

  checkTotalImages(purchase) {
    //actualizo lista de items comprados
    this.totalInCart = this._itemService.getItemsComprados();
    console.log("purchase.totalImages", purchase.totalImages);

    console.log("totalInCart", this.totalInCart);
    //verifico si lo que hay en el cart , es lo mismo permitido por el purchase

    let totalImages = purchase.totalImages;
    let imagenesRestantes = purchase.totalImages;
    if (!isNullOrUndefined(purchase.items))
      imagenesRestantes = totalImages - purchase.items.length;

    console.log("imagenesRestantes", imagenesRestantes);

    if (purchase.totalImages > 0)
      if (this.totalInCart.length <= imagenesRestantes) {
        //es valido
        console.log("la compra es valida");
        if (confirm("The remaining items on your coupon: " + imagenesRestantes + "\r\n The purchase to be made " + this.totalInCart.length)) {
          return true;

        } else
          return false;

        //genero la asociacion de ese purchase con la compra de la imagencial

      }
      else {
        this.message.error = "No remaining items";
        this.ShowMessageError = true;
        console.log("la compra es Invalida");
        //muestro error por querer u
        return false;
      }

  }

  AsociarPurchase(purchaseId, items) {
    console.log("purchaseId:", purchaseId, "items:", items.length);
    //recibo id , y los items , lo mando al rest para que asocie la compra
    //solamente mando la lista de id
    let myItems = items.map((x) => {
      let id: string = x.id;
      return id;
    });

    this._purchaseService.asociarCompra(purchaseId, myItems)
      .subscribe(message => {


        let id = JSON.parse(message);
        id = id.message;

        console.log("id:", id);
        this.emptyCart.emit({});
        this.router.navigate(['/download'], { queryParams: { id: id } });

      }
      );
  }


  clickCheckboxCoupon() {

    this.isChecked = !this.isChecked;

  }



}
