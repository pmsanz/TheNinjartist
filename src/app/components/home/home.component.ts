import { Component, OnInit } from '@angular/core';
import {ItemComponent} from '../item/item.component';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

public items:Array<ItemComponent>;

  constructor(private router: Router) {

   

    
   }

  ngOnInit(): void {
   

     if (isNullOrUndefined(localStorage.getItem('acceptTyC'))) {
      
        this.router.navigate(['/intro']);
      
    }

  }

}
