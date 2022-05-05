import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommentInterface } from 'src/app/models/comment';
import { CommentService } from 'src/app/services/comment.service';

// declare var $: any;

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnChanges {


  @Input() commentMessage: CommentInterface;
  @Output() commentRepplied = new EventEmitter();


  constructor(private _commentService: CommentService) {

    // let d = new Date();

    // this.commentPrimary = {
    //   _id: '123456487',
    //   email: 'pepe@gmmail.com',
    //   userName: 'MaximusOverload',
    //   date: this.castearDate(),
    //   comment: "More Aliens pls!!!"
    // }

  }
  ngOnChanges(changes: SimpleChanges): void {
    
  }

  ngOnInit(): void {
  }


  castearDate(): string {

    let date = new Date()

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    if (month < 10) {
      return `0${month}-${day}-${year}`;
    } else {
      return `${month}-${day}-${year}`;
    }

  }

  // checkBoxCheked() {

  //   // console.log("comment, emitiendo");
  //   this.commentMessage.checked = !this.commentMessage.checked;
  //   this.commentRepplied.emit({ type: "checkboxCommentEvent", data: this.commentMessage });

  // }

  mostrarModalReply(Reply: CommentInterface) {

    this.commentRepplied.emit({ type: "ShowModalReplyCommentEvent", data: Reply });

  }

  btnReply_Click() {

    this.commentMessage.checked = !this.commentMessage.checked;
    this.commentRepplied.emit({ type: "btnReplyEvent", data: this.commentMessage });

  }

  btnReport_Click() {

    if (confirm("Are you sure, to report this comment, CommentID :  " + this.commentMessage.commentID)) {
      let commentID = this.commentMessage.commentID.toString();
      let commentMessage = this.commentMessage.comment;


      this._commentService.reportComment(commentID, commentMessage).subscribe(
        response => {
          console.log("recibiendo respuesta", response);
          let json = JSON.parse(response);
          let status = json.status;
          let message = json.message;

          if(status == "OK"){

            alert("Comment ID : " + commentID + " was reported to Moderators");

          }

          if(status == "ERROR"){

            console.log("Error reporting message " + message);
          }


        }, error => {
          console.log("recibiendo error", error);
        }

      );

    } else
      return false;
    
  }




}
