import { Component, OnInit, SimpleChanges } from "@angular/core";
import { Subscription } from "rxjs";
import { PurchaseService } from "./services/purchase.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public _mostrar: boolean = false;
  title = 'Ninjartist';

  ngOnInit() {
  }

  mostrar() {

    this._mostrar = !this._mostrar;

  }

  eventMostrar(event) {

    this._mostrar = event.bmostrar;
  }

}

