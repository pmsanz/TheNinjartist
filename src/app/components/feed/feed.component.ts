import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemInterface } from 'src/app/models/item-interface';
import { FeedInterface } from 'src/app/models/feed-interface';
import { Global } from 'src/app/services/global';
import { CommentInterface } from 'src/app/models/comment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  @Input() feed_input: ItemInterface;
  @Output() commentRepplied = new EventEmitter();
  public url: string;


  constructor(private router: Router) {

    this.url = Global.url + Global.method;
  }

  ngOnInit(): void {

    //if only accepts TyC
    if (localStorage.getItem('acceptTyC') == null || localStorage.getItem('acceptTyC') == undefined)
      this.router.navigate(['/intro']);

    console.log("feed_input.comments,", this.feed_input.comments);
    console.log("feed_input,", this.feed_input);

    if (this.feed_input.imagePreview == undefined || this.feed_input.imagePreview == null)
      this.feed_input.imagePreview = Global.emptyImageUrl;

    if (this.feed_input != null && this.feed_input != undefined) {
      this.feed_input.comments.forEach(comment => {
        comment.checked = false;
      })
    }

  }

  commentReplied(event) {

    // console.log("feed, evento recibido:", event);
    if (event != null && event != undefined) {
      //burbujeo el comentario

      this.commentRepplied.emit(event);

    }


  }





  

}
