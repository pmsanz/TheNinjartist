import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  public labelError: boolean;
  public mensajeEnviado: boolean;
  public message: any;
  constructor(public _contactService: ContactService) {
    this.labelError = false;
    this.mensajeEnviado = false;
    this.message = {

      userMail: "",
      userMessage: ""

    }
   
  }


  ngOnInit(): void {
  }

  onSubmit() {
    let mail = this.message.userMail.toString();
    let userMessage = this.message.userMessage.toString();

    //valido si el mail contiene @ algo.
    console.log("datos", mail.includes('@'), userMessage.length);
    if (mail.includes('@') && mail.includes('.com') && userMessage.length > 1) {
      //valido
      //submit()
      this.labelError = false;

      if (!isNullOrUndefined(localStorage.getItem('mensajeEnviado'))) {
        let msgSended: number = JSON.parse(localStorage.getItem('mensajeEnviado'));
        var diff = Math.abs(msgSended - Date.now());
        var minutes = Math.floor((diff/1000)/60);

        if(minutes<5){

          alert("Please wait, 5 minutes to send, another message.");
          return;
        }
        
      }


      this._contactService.enviarMail("Mail sended from :" + mail,userMessage).subscribe(message => {
        if (!isNullOrUndefined(message)) {
          //console.log("respuesta del envio mails", message);
          alert("Enviado!");
          localStorage.setItem('mensajeEnviado', JSON.stringify(Date.now()));
        }

      });
      this.message.userMail = "";
      this.message.userMessage = "";
      this.labelError = false;
      this.mensajeEnviado = true;

      //   localStorage.removeItem('mensajeEnviado');
    
      //   localStorage.getItem('cartItems')
    }
    else {
      //invalido
      this.labelError = true;
    }


  }

}
