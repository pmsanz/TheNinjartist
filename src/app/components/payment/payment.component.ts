import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  public state: string = "NOT DEFINIED";
  public message: string = "";
  public message_error: string = "One error ocurrs when payment was processing, please report this issue to admins.";
  public message_success: string = "Payment Process Success!";
  public payerId: string = "";
  public token: string = "";
  public status: string = "";

  constructor(private router: Router,private route: ActivatedRoute, private _purchaseService: PurchaseService) { }

  ngOnInit(): void {

    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        console.log("params", params);
        this.payerId = params.PayerID;
        this.token = params.token;
        this.status = params.status;

        console.log("status", this.status)
        if (this.status == 'success') {
          this.message = this.message_success;
          this.state = 'APROVED';
          this.setAproved(this.token, this.payerId);
        } else if (this.status == 'error') {
          this.message = this.message_error;
          this.state = 'ERROR';

        }


      });
  }


  setAproved(tokenId: string, payerId: string) {

    //recibe tokenID and set it, to aproved.
    this._purchaseService.setAproved(tokenId, payerId).subscribe(res => {
      let response = JSON.parse(res);
      console.log("seteado en aprovved correctamente: " + response);
      console.log("restatus", response.status);
      if (response.status == "OK") {

        this.captureOrder(tokenId);
      }
      else {
        console.log("error al querer aprobar orden " + tokenId + " error : " + response.message + " " + response.status);

      }
    }, err => {

      console.log("error al setear en aprobado: " + err);

    })

  }

  captureOrder(tokenId: string) {
    console.log("intendando capturar " + tokenId);
    //recibe tokenID and set it, to aproved.
    this._purchaseService.captureOrder(tokenId).subscribe(res => {
      let response = JSON.parse(res);
      console.log("capturado correctamente: " + response.status);
      if(response.status == "OK"){
        
        this.router.navigate(['/download'], { queryParams: { id: tokenId } });
      }


    }, err => {

      console.log("error al capturar: " + err);

    })

  }


}
