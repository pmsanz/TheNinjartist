import { CommentInterface } from './comment';

export interface FeedInterface {
    _id?: string;
    tittle?:string;
    description?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    comments?:Array<CommentInterface>;
  }