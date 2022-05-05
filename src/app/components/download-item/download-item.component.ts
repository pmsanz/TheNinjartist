import { Component, OnInit, Input } from '@angular/core';
import { ItemInterface } from 'src/app/models/item-interface';
import { saveAs as importedSaveAs } from "file-saver";
import {Global} from '../../services/global';

@Component({
  selector: 'app-download-item',
  templateUrl: './download-item.component.html',
  styleUrls: ['./download-item.component.css']
})

export class DownloadItemComponent implements OnInit {

  @Input() item: ItemInterface;
  public url: string;
  constructor() {

    this.url = Global.url + "items/getImage/";
  }

  ngOnInit(): void {
    console.log("dentro de download-item", this.item);
  }

  downloadItem() {

    //var url2 = this.item.imageFull;
    
    var mimeType = "image/jpg";

    console.log("dentro de DownloadITem", filename, mimeType);

    // fetch(url2).then(function (res) { return res.arrayBuffer(); }).then(function (buf) {
    //   const url = window.URL.createObjectURL(new File([buf], filename, { type: mimeType }));
    //   window.open(url);
    //   // return new File([buf], filename, { type: mimeType });
    // })
    
    for (let index = 0; index < this.item.imageFull.length; index++) {
      const url2 = this.url + this.item.imageFull[index];
      var filename = this.item.titulo+ "_" + index + ".jpg";
      importedSaveAs(url2, filename);
      
    }





  }

}
