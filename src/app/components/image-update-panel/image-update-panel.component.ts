import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Global } from '../../services/global';
import { ItemService } from '../../services/item.service';
import { isNullOrUndefined } from 'util';
import { ItemInterface } from 'src/app/models/item-interface';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-image-update-panel',
  templateUrl: './image-update-panel.component.html',
  styleUrls: ['./image-update-panel.component.css']
})
export class ImageUpdatePanelComponent implements OnInit, OnChanges {
  public url: string;
  @Input() itemInput: ItemInterface;
  
  public message: any;
  public isModifying: boolean;
  showUploadbtn: boolean = false;
  showBtns: boolean = false;
  labelError: boolean = false;
  public afuConfigSingleFile: any;
  public afuConfigMultiFile: any;
  public showMultiBtn = true;

  public actionBtn: string;
  public nComponents: Array<string>;
  private indice: number;

  constructor(public _itemService: ItemService, private _authService: AuthService) {
    this.isModifying = false;
    this.actionBtn = "Create";
    this.url = Global.url + "items/getImage/";
    this.nComponents = [Global.emptyImage];
    this.message = {

      titulo: "",
      contenido: "",
      imagePreview: "",
      imageFull: "",
      height: "",
      width: "",
      weight: ""

    }


    this.showBtns = true;




  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.id contains the old and the new value...
    console.log("itemInput:", this.itemInput);
    this.nComponents = [];
    if (!isNullOrUndefined(this.itemInput.id)) {
      if (this.itemInput.id != "") {

        //console.log("itemInput:", this.itemInput);
        this.isModifying = true;
        this.message.titulo = this.itemInput.titulo;
        this.message.contenido = this.itemInput.contenido;

        if (this.itemInput.imagePreview != "") {
          //this.previewImageMin = this.itemInput.imagePreview;
          this.nComponents[0] = this.itemInput.imagePreview;
        } else {
          this.nComponents.push(Global.emptyImage);
        }

        //meter modulo securizado para obtener imagenes
        this._itemService.getItemSecure(this.itemInput.id)
          .subscribe((response) => {
            // console.log("response",response);
            let message = JSON.parse(response);
            let item = message.item;
            // console.log("item",item);
            // console.log("status",message.status);
            if (!isNullOrUndefined(item) && message.status == "OK")

              if (item.imageFull != [] && item.imageFull.length > 0) {

                for (let index = 0; index < item.imageFull.length; index++) {
                  const element = item.imageFull[index];
                  this.nComponents.push(element);
                }
                this.nComponents.push(Global.emptyImage);

              } else
                this.nComponents.push(Global.emptyImage);
            else {
              this.nComponents.push(Global.emptyImage);
            }


          },
            error => {
              console.log("error", error);
            })



        this.actionBtn = "Modify";
        this.message.weight = this.itemInput.weight;
        this.message.height = this.itemInput.height;
        this.message.width = this.itemInput.width;
        this.showUploadbtn = true;
        //this.nComponents.push(this.itemInput.imagePreview);
        //this.actualizarAfu(this.itemInput.id);
      } else {
        this.message = {

          titulo: "",
          contenido: "",
          imagePreview: "",
          imageFull: "",
          height: "",
          width: "",
          weight: ""

        }
        this.isModifying = false;
        this.actionBtn = "Send!";

      }





    }
  }
  ngOnInit(): void {

    // Afu config Multi

    this.afuConfigMultiFile = {
      multiple: true,
      formatsAllowed: ".jpg,.png",
      maxSize: "50",
      uploadAPI: {
        url: Global.url + "items/upload/?id=" + this.itemInput.id + "@multi@" + this._authService.getToken(),
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
      attachPinText: 'Upload Image'
    };

  }


  onSubmit() {
    alert("formulario enviado");
    if (!this.isModifying) {

      this._itemService.createItem(this.message)
        .subscribe(response => {
          if (response) {
            this.itemInput.id = response;
            //  console.log("id devuelto", this.id);
            this.showUploadbtn = true;
            this.isModifying = true;
            this.actionBtn = "Modify";
            //this.actualizarAfu(response);
            this.nComponents = [];
            this.nComponents.push(Global.emptyImage);
            this._itemService.convertToItems();
          } else {
            //   console.log("error al recibir response");
          }

        }, error => { console.log("error", error); });

    } else {
      //actualizando item
      let myItem: ItemInterface;
       
        myItem.id = this.itemInput.id;
        myItem.titulo = this.message.titulo;
        myItem.imagePreview = "";
        myItem.imageFull = [];
        myItem = this.message.contenido;
        myItem = this.message.height;
        myItem = this.message.width;
        myItem = this.message.weight;
      
      console.log("modificando Item");
      this._itemService.updateItem(myItem).subscribe(response => {
        if (response) {
          console.log("response update", response);
          this._itemService.convertToItems();
        } else {
          console.log("no hay response");
        }

      }, error => { console.log("error", error); });
    }
  }

  DocUpload(event) {

    alert("termino de subir");
    let itemUpdate: any;
    let type: any;
    console.log("DENTRO DE DocUpload:", event);

    if (event) {

      itemUpdate = event.body.itemUpdate;
      type = event.body.type;

    }


    if (!isNullOrUndefined(itemUpdate)) {
      console.log("DENTRO DE EVENT id:", itemUpdate);

      //en caso de que el primer item este en "", siginifca que devuelve el preview
      //en caso contrario trae el ultimo imageFull y lo pone en el array
      if (type == 0) {
        console.log("imagePreview", itemUpdate.imagePreview)
        this.nComponents[0] = itemUpdate.imagePreview;
        //agrego solamente si existe el preview
        if (this.nComponents.length == 1)
          this.nComponents.push(Global.emptyImage);
      }
      else {
        //type = 1 , cuando es el imageFull[0]
        //console.log("imagefull resItem.imageFull.length - 1",itemUpdate.imageFull.length - 1 )
        console.log("type, image full:", type, itemUpdate.imageFull.length)

        if (itemUpdate.imageFull.length > 0 && itemUpdate.imageFull.length >= (parseInt(type) - 1)) {
          this.nComponents[type] = itemUpdate.imageFull[type - 1];
          console.log("actualizo indice");
          if (this.nComponents.length - 1 == parseInt(type)) {
            console.log("agrego", this.nComponents.length, type);
            this.nComponents.push(Global.emptyImage);
          }

          return;
        }
        else if (itemUpdate.imageFull.length < 1) {
          console.log("error");
          return;
        }


      }




    }

    // if (event.body.imagePreview != "")
    //   this.previewImageMin = event.body.imagePreview;

    this.isModifying = true;
    //   this._itemService.convertToItems();
    //   console.log(this.fullImageMin);
    //   console.log(this.previewImageMin);
    //   console.log("actualizando lista de items...");
  }

  actualizarAfu(p1) {
    //console.log("actualizando afu" + this.itemInput.id);
    this.afuConfigSingleFile = {
      multiple: false,
      formatsAllowed: ".jpg,.png",
      maxSize: "50",
      uploadAPI: {
        url: Global.url + "items/upload/?id=" + this.itemInput.id + "@" + p1 + "@" + this._authService.getToken(),
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
      attachPinText: 'Upload Image'
    };

    //console.log("this.afuConfig",this.afuConfigSingleFile.uploadAPI.headers);
    return this.afuConfigSingleFile;

  }



  newArticle() {

    this.itemInput = {};
    this.isModifying = false;
    this.actionBtn = "Send!";
    this.message = {

      titulo: "",
      contenido: "",
      imagePreview: "",
      imageFull: "",
      height: "",
      width: "",
      weight: ""

    };
    this.showUploadbtn = false;
  }

  checkFeed() {
    console.log("dentro de check")

    this.showMultiBtn = !this.showMultiBtn;

  }

  borrarImagen(id) {

    if (confirm(" Delete Image? " + id)) {
      console.log("eliminandoImagen");

      this._authService.isLoging();

    }
  }

}
