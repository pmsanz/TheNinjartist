export interface CommentInterface {
    _id?: string;
    commentID?:number;
    isReply?:boolean;
    email?: string;
    userName?: string;
    createdAt?: string;
    updatedAt?: string;
    comment?: string;
    Reply?:CommentInterface;
    checked?: boolean;
  }