import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
  selector: 'app-validating-circle',
  templateUrl: './validating-circle.component.html',
  styleUrls: ['./validating-circle.component.css']
})
export class ValidatingCircleComponent implements OnInit, OnDestroy {

  public showCircle: boolean = false;
  subscriptionLoadingCircle: Subscription;

  constructor(private _PurchaseService: PurchaseService) { }
  ngOnDestroy(): void {
    if (this.subscriptionLoadingCircle != null) {
      this.subscriptionLoadingCircle.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.subscriptionLoadingCircle = this._PurchaseService.getSubscriptionLoadCircle()
      .subscribe(obj => {

        console.log("obj", obj);
        if (obj.state == "show") {
          //show the circle loading
          this.showCircle = true;
        }
        else {
          //hide the circle loading
          this.showCircle = false;
        }

      });

  }

}
