import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Global } from '../../services/global';
import { ItemService } from '../../services/item.service';
import { isNullOrUndefined } from 'util';
import { ItemInterface } from 'src/app/models/item-interface';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ItemUploadInterface } from 'src/app/models/itemUpload-interface';
@Component({
  selector: 'app-image-update-panelv2',
  templateUrl: './image-update-panelv2.component.html',
  styleUrls: ['./image-update-panelv2.component.css']
})
export class ImageUpdatePanelv2Component implements OnInit, OnChanges {
  public url: string;
  @Input() itemInput: ItemInterface;
  public itemEditing: ItemUploadInterface = { item: { imageFull: [], type: "Store" }, formulario: new FormData() };

  //images to upload
  imagesFullToUpload: FileList = null;
  imagePreviewToUpload: File = null;
  //porcent loadbar
  public uploadedPercentage = "0%";

  public isLoading: Boolean = false;
  public isStore: Boolean = true;
  private loadBarSubscription: Subscription;

  public isModifying: boolean;
  showUploadbtn: boolean = false;
  showBtns: boolean = false;
  labelError: boolean = false;
  public showMultiBtn = true;
  public sTypeList: Array<string>;

  public actionBtn: string;
  public inputPreviewImageString: string;
  public inputFullImageString: string;

  public resultSRC: string | ArrayBuffer = Global.emptyImageUrl;


  constructor(public _itemService: ItemService,
    private _authService: AuthService) {
    this.isModifying = false;
    this.actionBtn = "Create";
    this.url = Global.url + "items/getImage/";

    this.itemEditing.item = {

      titulo: "",
      contenido: "",
      imagePreview: "",
      imageFull: [],
      height: 0,
      width: 0,
      weight: 0,
      type: "Store"

    }
    this.itemEditing.formulario = new FormData();

    this.showBtns = true;
    this.sTypeList = [];
    this.sTypeList.push("Store")
    this.sTypeList.push("Feed")
    this.itemEditing.item.price = 5;

  }

  ngOnChanges(changes: SimpleChanges) {

    if (!isNullOrUndefined(this.itemInput.id)) {
      if (this.itemInput.id != "") {

        //console.log("itemInput:", this.itemInput);
        //Selecciono todos los datos del item traido
        this.isModifying = true;
        this.itemEditing.item.titulo = this.itemInput.titulo;
        this.itemEditing.item.contenido = this.itemInput.contenido;
        this.itemEditing.item.price = this.formatPriceDivision(this.itemInput.price);
        this.itemEditing.item.type = this.itemInput.type;
        this.itemEditing.item.id = this.itemInput.id;
        
      }
    }
    this.getItemSecure();

  }
  onChangeType(value): void {
    this.itemEditing.item.type = value;
    if(value=="Feed"){

      this.itemEditing.item.imageFull = [];
      this.itemEditing.item.price = null;

    }
    else{
      this.itemEditing.item.price = 5;
    }
    
  }

  getItemSecure() {

    //meter modulo securizado para obtener imagenes
    this._itemService.getItemSecure(this.itemInput.id)
    .subscribe((response) => {
      console.log("response", response);
      let message = JSON.parse(response);
      let item = message.item;
      // console.log("item",item);
      // console.log("status",message.status);
      if (item != undefined && message.status == "OK") {

        //image preview
        if (item.imagePreview != null && item.imagePreview != undefined) {
          this.itemEditing.item.imagePreview = item.imagePreview;
        }
        else {
          this.itemEditing.item.imagePreview = null;
        }

        //imageFulls
        this.itemEditing.item.imageFull = [];
        if (item.imageFull != null && item.imageFull != undefined) {
          for (let index = 0; index < item.imageFull.length; index++) {
            //mostrar imagenes fullImages
            this.itemEditing.item.imageFull.push(item.imageFull[index]);
          }
        }


      }


    },
      error => {
        console.log("error", error);
        alert("Error al obtener item ");
      })
  }

  formatPriceDivision(price: number): number {
    let retVal = 0;
    retVal = price / 100;

    if (retVal > 1)
      return retVal;
    else
      return 0;
  }
  formatPriceMultiply(price: number): number {
    let retVal = 0;
    retVal = price * 100;

    if (retVal > 100)
      return retVal;
    else
      return 500;
  }
  ngOnInit(): void {


    this.loadBarSubscription = this._itemService.getLoadBarSubscription().subscribe(status => {

      //console.log("DENTRO CURSO-ABM:", status);

      if (status.state == 'inProgress') {
        this.uploadedPercentage = status.value + '%';
        this.isLoading = true;
      } else if (status.state == 'completed') {
        this.uploadedPercentage = 100 + '%';
        this.isLoading = false;
        alert("Archivo Subido Correctamente!")
        this.uploadedPercentage = 0 + '%';
        this.itemInput.id = this.itemEditing.item.id;
        this.getItemSecure();

      } else if (status.state == 'error') {
        this.uploadedPercentage = 0 + '%';
        this.isLoading = false;
        alert("Error al querer subir archivo")
      }

    });

  }


  onSubmit(f: NgForm) {


    this.createItemOrUpdate();
    // this.limpiar(f);
    //console.log("submitedd!")



  }
  preview_image(cb) {
    var reader = new FileReader();

    reader.readAsDataURL(this.imagePreviewToUpload);

    reader.onload = function () {

      cb(reader.result);

    }

  }

  limpiar(f: NgForm) {

    this.itemEditing.item = {

      id: null,
      price: 5,
      titulo: "",
      contenido: "",
      imagePreview: "",
      imageFull: [],
      height: 0,
      width: 0,
      weight: 0,
      type: "Store"

    }
    this.itemEditing.formulario = null;
    //console.log("dentro de form", f);
    f.reset();
    this.isModifying = false;

  }

  DocUpload(event) {


  }



  updateImages() {


    let formulario = new FormData();
    let item: ItemInterface = {};
    //creo o actualizo el nuevo item

    let obj = { id: "", formulario: formulario };
    if (this.itemEditing.item.id && this.itemEditing.item.id != "")
      obj.id = this.itemEditing.item.id;

    //actualizo las imagenes
    formulario = this.CrearForPorPropiedades(obj);
    //anexo imagePrview
    if (this.imagePreviewToUpload != null) {
      const element = this.imagePreviewToUpload;
      formulario.append('imagePreview', element, element.name);
    }

    //anexo ImagesFull
    if (this.imagesFullToUpload != null)
      if (this.imagesFullToUpload.length > 0)
        for (let index = 0; index < this.imagesFullToUpload.length; index++) {
          const element = this.imagesFullToUpload.item(index);
          formulario.append('imagesFull', element, element.name);
        }


    this.itemEditing.formulario = formulario;

    // this.loadBarSubscription = this._itemService.getLoadBarSubscription()
    //   .subscribe(response => {

    //     if (response.state == 'completed') {

    //       console.log("completado!!");

    //     }
    //     else if (response.state == 'error') {
    //       console.log("Error al subir video")
    //       alert("Error al actualizar video, error:" + response.message);
    //     }

    //   })

    this._itemService.createNew(this.itemEditing.formulario);

  }


  createItemOrUpdate() {

    if (!this.isModifying) {

      this._itemService.createItem(this.itemEditing.item)
        .subscribe(response => {
          if (response) {
            this.itemEditing.item.id = response;
            console.log("id devuelto", response);
            this.isModifying = true;
            this.actionBtn = "Modify";
            this.updateImages();
            this._itemService.getAllItemSecure();
          } else {
            //   console.log("error al recibir response");
          }

        },
        error => {
          console.log("error", error);
          alert("Error al querer crear un nuevo item");
        })

    } else {
      this._itemService.updateItem(this.itemEditing.item).subscribe(response => {
        if (response) {
          console.log("response update", response);
          this.updateImages();
          this._itemService.getAllItemSecure();
        } else {
          console.log("no hay response");
        }

      }, error => { console.log("error", error); });
    }

  }

  checkFeed() {


  }

  borrarImagen(number) {

    if (number == 0) {
      //borra imagePreview
      this.imagePreviewToUpload = null;
    }
    else if (number > 0) {
      //borra el indice de la imagene
      this.imagesFullToUpload[number] = null;
    }

  }

  handleSingleFileInput(file: FileList) {
    this.imagePreviewToUpload = file[0];
  }

  handleMultipleFileInput(files: FileList) {
    this.imagesFullToUpload = files;
  }

  CrearForPorPropiedades(entidad): FormData {
    //recorre todas las propiedades menos, el formulario
    let resultado: FormData = new FormData();
    resultado = entidad.formulario;

    Object.keys(entidad).map(function (key, index) {
      console.log("propiedades", entidad[key], key);

      if (key != null) {
        if (key != 'formulario') {
          if (resultado.getAll(key).length == 0)
            resultado.append(key, entidad[key]);
          else
              resultado.set(key, entidad[key]);

        }
        else
          console.log("key", key);
      }
    });

    return resultado;
  }

}