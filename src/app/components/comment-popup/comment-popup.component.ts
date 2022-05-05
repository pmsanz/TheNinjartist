import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommentInterface } from 'src/app/models/comment';

@Component({
  selector: 'app-comment-popup',
  templateUrl: './comment-popup.component.html',
  styleUrls: ['./comment-popup.component.css']
})
export class CommentPopupComponent implements OnInit, OnChanges {

  @Input() commentpopup: CommentInterface;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("commentpopup", this.commentpopup);
  }

  ngOnInit(): void {

  }

}
