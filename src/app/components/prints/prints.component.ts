import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prints',
  templateUrl: './prints.component.html',
  styleUrls: ['./prints.component.css']
})
export class PrintsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {

   //if only accepts TyC
   if (localStorage.getItem('acceptTyC') == null || localStorage.getItem('acceptTyC') == undefined)
   this.router.navigate(['/intro']);

  }

}
