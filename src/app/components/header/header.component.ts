import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  public sLink: string = 'home'
  public sTitle: string;
  public bIsUpper: boolean = false;
  

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.url.subscribe(url => {

      console.log("url", url[0].path)
      this.sLink = url[0].path;
      
      if (url[0].path == 'home')
        this.sTitle = 'store';
      else if (url[0].path == 'feed')
        this.sTitle = 'community';
      else if (url[0].path == 'faq'){
        console.log("es faq")
        this.sTitle = 'faq';
        this.bIsUpper = true;
      }        
      else
        this.sTitle = url[0].path;
        

        console.log("valor de bIsUpper", this.bIsUpper)
      // if (this.sTitle.toLowerCase().includes("q") == true) 
      // {
      //   this.qFix = true;
      // }

    })

  }



}
