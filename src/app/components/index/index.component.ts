import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  @Input() public pages: number;
  public pagesArray: Array<number>;

  constructor() {
    this.pagesArray = [];

    

  }

  ngOnInit(): void {
    
    //console.log(this.pages);
    if (this.pages > 0) {

      for (let index = 0; index < this.pages; index++) {
        //console.log(index);
        this.pagesArray.push(index + 1);

      }
      //console.log(this.pagesArray.length);


    }

  }

}
