import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentInterface } from 'src/app/models/comment';



@Component({
  selector: 'app-comment-array',
  templateUrl: './comment-array.component.html',
  styleUrls: ['./comment-array.component.css']
})
export class CommentArrayComponent implements OnInit {

  @Input() comments: Array<CommentInterface>;
  @Output() commentRepplied = new EventEmitter();



  constructor() {



  }

  ngOnInit(): void {

    console.log("comentarios,", this.comments)
    this.comments.map(comment => {
      comment.isReply = false;
      //casteo la fecha para que se vea bien
      let date: Date = new Date();
      date.setTime(Date.parse(comment.createdAt));
      comment.createdAt = this.castearDate(date);

      if (comment.Reply != undefined && comment.Reply != null) {
        this.setearReply(comment.Reply);
      }

    })
    //ordeno los comentarios segun la fecha de creacion
    this.comments.sort((a, b) => {
      //casteo a y b
      let dateA: Date = new Date();
      let dateB: Date = new Date();
      dateA.setTime(Date.parse(a.createdAt));
      dateB.setTime(Date.parse(b.createdAt));

      if (dateA == dateB)
        return 0;
      if (dateA > dateB)
        return -1;
      if (dateA < dateB)
        return 1;

    });


    

  }

  setearReply(Reply_comment: CommentInterface) {
    //es replica
    Reply_comment.isReply = true;
    //casteo el date
    if (Reply_comment.createdAt != undefined && Reply_comment.createdAt != null) {
      let date: Date = new Date();
      date.setTime(Date.parse(Reply_comment.createdAt));
      Reply_comment.createdAt = this.castearDate(date);
    }

    if (Reply_comment.Reply != undefined && Reply_comment.Reply != null) {
      this.setearReply(Reply_comment.Reply);
      return;
    }

  }

  castearDate(date: Date): string {



    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if (month < 10) {
      return `0${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
    } else {
      return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
    }

  }


  commentReplied(event) {

    
    if (event != null && event != undefined) {
      //burbujeo el comentario
      let comment: CommentInterface = event.data;
      console.log("comment-array, ecomment:", comment);
      this.uncheckArray(comment._id);
      this.commentRepplied.emit(event);

    }


  }

  uncheckArray(_id: string) {

    this.comments.forEach(comment => {

      
      if (comment._id != _id) {
        comment.checked = false;
      }

      // console.log("comment " + comment.commentID , comment)

    })

  }



}
