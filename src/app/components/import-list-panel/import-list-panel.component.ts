import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-import-list-panel',
  templateUrl: './import-list-panel.component.html',
  styleUrls: ['./import-list-panel.component.css']
})

export class ImportListPanelComponent implements OnInit {

  @Input() message: any;

  constructor() {


    console.log("constructor");

  }


  ngOnInit(): void {
  }



}
