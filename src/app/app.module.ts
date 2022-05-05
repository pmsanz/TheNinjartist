import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { appRoutingProviders, routing } from './app.routing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { AssideComponent } from './components/asside/asside.component';
import { ItemComponent } from './components/item/item.component';
import { LoginComponent } from './components/login/login.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FaqComponent } from './components/faq/faq.component';
import { ContactComponent } from './components/contact/contact.component';
import { ImageUpdateComponent } from './components/image-update/image-update.component';
import { ImageListComponent } from './components/image-list/image-list.component';
import { ImageUpdatePanelComponent } from './components/image-update-panel/image-update-panel.component';
import { DownloadComponent } from './components/download/download.component';
import { ImportListComponent } from './components/import-list/import-list.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { HeaderComponent } from './components/header/header.component';
import { AccordionBasicComponent } from './components/accordion-basic/accordion-basic.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ListItemX3Component } from './components/list-item-x3/list-item-x3.component';
import { IndexComponent } from './components/index/index.component';
import { ModalComponent } from './components/modal/modal.component';
import { DownloadItemComponent } from './components/download-item/download-item.component';
import { ImportListPanelComponent } from './components/import-list-panel/import-list-panel.component';
import { DummyComponent } from './components/dummy/dummy.component';
import { CartAssideComponent } from './components/cart-asside/cart-asside.component';
import { CartAssideItemComponent } from './components/cart-asside-item/cart-asside-item.component';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import { IntroComponent } from './components/intro/intro.component';
import { PrintsComponent } from './components/prints/prints.component';
import { FeedComponent } from './components/feed/feed.component';
import { CommentComponent } from './components/comment/comment.component';
import { CommentGeneratorComponent } from './components/comment-generator/comment-generator.component';
import { CommentArrayComponent } from './components/comment-array/comment-array.component';
import { PaymentComponent } from './components/payment/payment.component';
import { FeedListComponent } from './components/feed-list/feed-list.component';
import { CommentPopupComponent } from './components/comment-popup/comment-popup.component';
import { ImageUpdatePanelv2Component } from './components/image-update-panelv2/image-update-panelv2.component';
import { ValidatingCircleComponent } from './components/validating-circle/validating-circle.component';



@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    AssideComponent,
    ItemComponent,
    LoginComponent,
    CheckoutComponent,
    FaqComponent,
    ContactComponent,
    ImageUpdateComponent,
    ImageListComponent,
    ImageUpdatePanelComponent,
    DownloadComponent,
    ImportListComponent,
    HomeComponent,
    ErrorComponent,
    HeaderComponent,
    AccordionBasicComponent,
    ItemListComponent,
    ListItemX3Component,
    IndexComponent,
    ModalComponent,
    DownloadItemComponent,
    ImportListPanelComponent,
    DummyComponent,
    CartAssideComponent,
    CartAssideItemComponent,
    IntroComponent,
    PrintsComponent,
    FeedComponent,
    CommentComponent,
    CommentGeneratorComponent,
    CommentArrayComponent,
    PaymentComponent,
    FeedListComponent,
    CommentPopupComponent,
    ImageUpdatePanelv2Component,
    ValidatingCircleComponent

  ],
  imports: [
    BrowserModule,
    [CommonModule],
    FormsModule,
    HttpClientModule,
    AngularFileUploaderModule,
    routing


  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
