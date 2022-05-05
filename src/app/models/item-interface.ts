import { CommentInterface } from './comment';
export interface ItemInterface {
    id?: string;
    titulo?:string;
    imagePreview?: string;
    imageFull?: Array<string>,
    contenido?: string;
    height?: number;
    width?: number;
    weight?: number;
    type?: string;
    price?: number;
    comments?:Array<CommentInterface>;
  }