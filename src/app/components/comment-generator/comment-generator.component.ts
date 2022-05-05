import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommentInterface } from 'src/app/models/comment';
import { FeedInterface } from 'src/app/models/feed-interface';
import { ItemInterface } from 'src/app/models/item-interface';
import { CommentService } from 'src/app/services/comment.service';
import { FeedService } from 'src/app/services/feed.service';

@Component({
  selector: 'app-comment-generator',
  templateUrl: './comment-generator.component.html',
  styleUrls: ['./comment-generator.component.css']
})
export class CommentGeneratorComponent implements OnInit, OnChanges {
  public _bIsRobot = true;
  @Input() Reply: CommentInterface;
  @Input() feed: ItemInterface;

  public commentToGenerate: CommentInterface;
  // public checkbox: any;
  constructor(private _commentService: CommentService,
    private _feedService: FeedService
  ) {

    

    // this.checkbox = { checked: false, disabled: true }
  }

  ngOnInit(): void {
    this.commentToGenerate = {
      comment: "",
      userName: "",
      Reply: this.Reply
    };
    console.log("this.Reply,", this.Reply);


  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("dentro de OnChanges, this.Reply", this.Reply)

    // if (this.Reply._id != undefined && this.Reply.checked) {
    //   this.checkbox.checked = true;
    //   this.checkbox.disabled = false;
    //   this.commentToGenerate.Reply = this.Reply;
    // }
    // else {
    //   this.checkbox.checked = false;
    //   this.checkbox.disabled = true;
    // }



  }

  checkboxClick() {

    this.Reply.checked = !this.Reply.checked;
    if (!this.Reply.checked) {
      this.Reply = {};
    }

  }

  clickCheckboxRobot(){

    this._bIsRobot = !this._bIsRobot;
  }

  validarRobot(): boolean {
    
    return !this._bIsRobot;
  }

  // this.commentsRepplied.forEach((value, index, array) => {
  //   if (index == 0) {
  //     this.idRepplies = value.commentID.toString();
  //   } else {
  //     this.idRepplies = this.idRepplies + "," + value.commentID.toString();
  //   }

  // })

  crearComentario() {
    this.commentToGenerate.Reply = this.Reply;
    //Al no estar checkeado no referencia nada.
    if (!this.Reply.checked) {
      this.commentToGenerate.Reply = undefined;
    }

    //Al no poner ningun usuario carga como anonymus.
    if (this.commentToGenerate.userName == "") {
      this.commentToGenerate.userName = "Anonymous";
    }

    if (this.commentToGenerate.comment.length > 0 && this.commentToGenerate.userName.length > 4) {

      if (this.validarRobot()) {

        this._commentService.createComment(this.commentToGenerate).subscribe(res => {
          //response del servicio
          console.log("response del commentService", res)
          let jsonObject = JSON.parse(res);
          let comment: CommentInterface = jsonObject.message;
          console.log("response del commentService", comment)
          console.log("feed Id", this.feed.id)


          //agrego el comentario al feed
          this._feedService.addCommentToFeed(comment._id, this.feed.id).subscribe(
            result => {
              //obtener resultado al agregar comment al feed
              console.log("mostrando resultado al agregar comment", result)
              this._feedService.alertChanges();
              this.cleanUser();
            });

        })
      }


    }
    //valido que los campos minimos esten completos.

    //valido que no sea un robot

    //invoco el commmentService para crear y arrojo mensaje

  }
  cleanUser() {

    this.commentToGenerate._id = "";
    this.commentToGenerate.comment = "";
    this.commentToGenerate.userName = "";

  }


}
