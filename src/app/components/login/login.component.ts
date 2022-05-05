import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserInterface } from 'src/app/models/user-interface';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { isError, isNullOrUndefined } from 'util';
import { NgForm } from '@angular/forms';
//import { NgForm } from '@angular/forms/src/directives/ng_form';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() loginEvent = new EventEmitter();

  constructor(private authService: AuthService, private router: Router, private location: Location) {

    // this.isLogin();

    authService.ifLoginHome();

  }
  public user: UserInterface = {
    email: '',
    password: ''
  };
  public isError = false;

  ngOnInit() { }

  // isLogin(){

  //   if(!isNullOrUndefined(this.authService.getToken())){
  //     //si detecta el token toma como que esta logueado y redirige
  //     this.router.navigate(['/home']);
  //     //console.log("tiene token",this.authService.getToken());
  //   }


  // }

  onLogin(form: NgForm) {
    if (this.isError) {

      alert("please wait a sec..");
      return;
    }

    if (form.valid) {
      console.log("formulario valido")
      return this.authService
        .loginuser(this.user.email, this.user.password)
        .subscribe(
          data => {
            console.log("Auth : ", data)
            this.authService.setUser(data.user);
            const token = data.id;
            this.authService.setToken(token);
            //location.reload();
            this.isError = false;
            this.router.navigate(['/home']);
          },
          error => {
            alert("Usuario o contraseña invalido");
            this.onIsError()
          
          }
        );
    } else {
      alert("Usuario o contraseña invalido");
      this.onIsError();
    }
  }

  onIsError(): void {
    this.isError = true;
    setTimeout(() => {
      this.isError = false;
    }, 4000);
  }


}
