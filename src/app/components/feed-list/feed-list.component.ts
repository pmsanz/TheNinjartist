import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ItemInterface } from 'src/app/models/item-interface';
import { FeedInterface } from 'src/app/models/feed-interface';
import { FeedService } from 'src/app/services/feed.service';
import { Global } from 'src/app/services/global';
import { CommentInterface } from 'src/app/models/comment';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.css']
})
export class FeedListComponent implements OnInit, OnChanges {

  public itemSelected: ItemInterface;
  public arrayFeeds: Array<ItemInterface>;
  public iCount: number = 0;
   public commentRepplied: CommentInterface;
  // public idRepplies: string = "";
  public ReplySelected: CommentInterface;
  public feedFocus: ItemInterface;

  public subscriptionFeed: Subscription;


  constructor(private _feedService: FeedService) {

    this.commentRepplied = {};
    this.arrayFeeds = [];
    this.ReplySelected = {};
    this.feedFocus = {};


  }
  ngOnChanges(changes: SimpleChanges): void {
     console.log("dentro de onChange Feed-List", this.commentRepplied)
    // if (this.idRepplies.length == 0) {
    //   this.commentsRepplied = [];
    // }
  }

  ngOnInit(): void {

    // this._feedService.getAllFeeds().subscribe(response => {

    //   // console.log("recibiendo respuesta de feeds", response);

    //   if (response != undefined) {
    //     let feeds_response = JSON.parse(response);
    //     if (feeds_response.status == "OK") {

    //       let feeds = feeds_response.message;
    //       // console.log("feed casteado", feeds);

    //       this.arrayFeeds = feeds;

    //       this.feedFocus = this.arrayFeeds[this.iCount];
    //     }
    //   }
    // })

    this.subscriptionFeed = this._feedService
      .getAllFeedsObservable()
      .subscribe(response => {

        if (response != null && response != undefined) {
          
          let message = response.localItemList;

          if (message != null && message != undefined) {
            console.log("recibiendo feed como subscription", message);

            let feeds_response = JSON.parse(message);
            if (feeds_response.status == "OK") {

              let feeds = feeds_response.message.map(item=>{
                item.id = item._id;
                return item;
              });
              console.log("feed casteado", feeds);

              this.arrayFeeds = feeds;

              this.feedFocus = this.arrayFeeds[this.iCount];
            }

          }
        }

      });

    this._feedService.alertChanges();

  }


  loadFeeds(val: number) {
    if (val > 0) {
      this.iCount = this.iCount + 1;
    }
    else {
      if (this.iCount > 0)
        this.iCount = this.iCount - 1;
    }
    this.feedFocus = this.arrayFeeds[this.iCount];
  }

  commentReplied(event) {

     console.log("feed-list,evento recibido:", event);
    if (event != null && event != undefined) {
      //verifico de que evento se trata
      if (event.type == "btnReplyEvent") {

        let comment: CommentInterface = event.data;
        this.commentRepplied = comment;

        console.log("commentRepplied: ", this.commentRepplied)


      } else if (event.type == "ShowModalReplyCommentEvent") {

        // console.log("dentro de Feedlist,ShowModalReplyCommentEvent", event.data)
        this.ReplySelected = event.data;

        $("#popumodal").modal('show');

      } else {

      }



    }
    // this.commentsRepplied = new_array;
  }



}
