import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';
import { isNullOrUndefined } from 'util';
import { Global } from '../../services/global';
import {AuthService} from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-import-list',
  templateUrl: './import-list.component.html',
  styleUrls: ['./import-list.component.css']
})
export class ImportListComponent implements OnInit {


  public message: any =
    {
      template: "",
      coupon: "",
      category: "Unique category"
    };

  public isModifying: boolean;
  showUploadbtn: boolean = false;
  showBtns: boolean = false;
  labelError: boolean = false;;
  public afuConfig1: any;
  public afuConfig2: any;
  public previewImageMin: string;
  public fullImageMin: string;
  public actionBtn: string;
  private subscription:Subscription;

  constructor(private _authService: AuthService,private router:Router) {

    _authService.ifNotLoginHome();
    
    this.subscription = _authService.subscribeSession().subscribe(message => {
      console.log("message",message);
      if (!isNullOrUndefined(message)) {
        //console.log("dentro de cart-asside",message);
       if(message.state=="close"){
         console.log("message",message);
         
         return this.router.navigate(['/home']);
       }
      }
    });

    this.isModifying = false;
    this.actionBtn = "Send!";



    this.afuConfig1 = {
      multiple: false,
      formatsAllowed: ".csv",
      maxSize: "50",
      uploadAPI: {
        url: Global.url + "coupon/upload",
        method: "POST",
        headers: {
          "Content-Type": "application/json"

        },


        responseType: 'json',

      },

      theme: "attachPin",
      hideProgressBar: false,
      hideResetBtn: false,
      hideSelectBtn: false,
      fileNameIndex: true,
      attachPinText: 'Upload Files'
    };
    this.afuConfig2 = {
      multiple: false,
      formatsAllowed: ".txt",
      maxSize: "50",
      uploadAPI: {
        url: Global.url + "coupon/uploadMessage/?token="+this._authService.getToken(),
        method: "POST",
        headers: {
          "Content-Type": "application/json"

        },


        responseType: 'json',

      },

      theme: "attachPin",
      hideProgressBar: false,
      hideResetBtn: false,
      hideSelectBtn: false,
      fileNameIndex: true,
      attachPinText: 'Upload Files'
    };


  }

  ngOnInit(): void {
  }

  DocUpload(event) {

    alert("termino de subir");
    console.log(event);

    if (!isNullOrUndefined(event.body.template) && !isNullOrUndefined(event.body.coupon)) {

      this.message.template = event.body.template;
      this.message.coupon = event.body.coupon;

      console.log("this.message", this.message);

    }

  }



}
