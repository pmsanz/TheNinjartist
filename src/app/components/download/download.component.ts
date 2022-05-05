import { Component, OnInit, OnChanges } from '@angular/core';
import { ItemInterface } from 'src/app/models/item-interface';
import { PurchaseService } from '../../services/purchase.service';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { saveAs as importedSaveAs } from "file-saver";
import { ActivatedRoute, Router } from '@angular/router';
import { Global } from '../../services/global';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css'],
  providers: [PurchaseService]
})
export class DownloadComponent implements OnInit, OnChanges {

  public itemList: Array<ItemInterface>;
  subscription: Subscription;
  subscriptionRoute: Subscription;
  showItems: Boolean;
  public id: string;
  public url: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public _purchaseService: PurchaseService,
    public _itemService : ItemService) {
    this.url = Global.url + "items/getImage/";
    this.id = '';
    this.showItems = false;
    this.itemList = [];


  }



  ngOnInit(): void {
    let id = "";
    this.subscriptionRoute = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        console.log("params", params);
        id = params.id;
      });

    // this.subscription = this._purchaseService.downloadById(id).subscribe(
    //   data => {
    //     this.itemList = data;
    //     this.showItems = true;

    //   },
    //   error => {
    //     //show error
    //     this.showItems = false;
    //     console.log('oops', error)
    //   }

    // );

    this.subscription = this._purchaseService.downloadByOrderId(id).subscribe(
      data => {
        
        let response = JSON.parse(data);
        console.log("recibiendo items del byOrderId:",response);
        this.itemList = response;
        this.showItems = true;
        this._itemService.cleanCart();

      },
      error => {
        //show error
        this.showItems = false;
        console.log('oops', error)
      }

    );

  }
  ngOnChanges(): void {

    console.log("Dentro de OnChanges", this.showItems, this.itemList);

  }

  downloadAllItem() {

    for (let index = 0; index < this.itemList.length; index++) {
      const element = this.itemList[index];

      for (let index = 0; index < element.imageFull.length; index++) {
        const img = element.imageFull[index];
        var filename = element.titulo + "_" + index + ".jpg";
        importedSaveAs(this.url + img, filename);
        
      }


    }


  }

}
