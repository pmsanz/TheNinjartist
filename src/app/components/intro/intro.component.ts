import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {

  private acceptTyC: boolean = false
  public checkedCheckbox: any;

  constructor(private router: Router) {

    this.checkedCheckbox = {
      checked: false
    };

    if (!isNullOrUndefined(localStorage.getItem('acceptTyC'))) {
      this.acceptTyC = JSON.parse(localStorage.getItem('acceptTyC'));
      console.log("existe el localstorage:",this.acceptTyC);
      if(this.acceptTyC){
        this.router.navigate(['/home']);
      }
    }


  }

  ngOnInit(): void {
  }


  accept() {

    if (this.checkedCheckbox) {
      this.acceptTyC = true;
      localStorage.setItem('acceptTyC', JSON.stringify(this.acceptTyC));
      this.router.navigate(['/home']);
    }




  }

  cancel() {

    window.location.href = 'https://www.google.com';

  }

}
