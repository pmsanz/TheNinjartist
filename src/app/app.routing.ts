import {ModuleWithProviders} from '@angular/core';
import {Route,RouterModule, Routes} from '@angular/router';
import{HomeComponent} from './components/home/home.component';
import{FaqComponent} from './components/faq/faq.component';
import{ErrorComponent} from './components/error/error.component';
import{ContactComponent} from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { ImageListComponent } from './components/image-list/image-list.component';
import {DownloadComponent} from './components/download/download.component';
import {ImportListComponent} from './components/import-list/import-list.component';
import {DummyComponent} from './components/dummy/dummy.component';
import {IntroComponent} from './components/intro/intro.component';
import {PrintsComponent} from './components/prints/prints.component';
import {CommentGeneratorComponent} from './components/comment-generator/comment-generator.component';
import { CommentComponent } from './components/comment/comment.component';
import { CommentArrayComponent } from './components/comment-array/comment-array.component';
import { FeedComponent} from './components/feed/feed.component';
import { PaymentComponent } from './components/payment/payment.component';
import { FeedListComponent } from './components/feed-list/feed-list.component';



const appRoutes:Routes = [

{path:'', component: IntroComponent},
{path:'intro', component: IntroComponent},
{path:'feed', component: FeedListComponent},
{path:'generator', component: CommentGeneratorComponent},
{path:'comment', component: CommentArrayComponent},
{path:'payment', component: PaymentComponent},
{path:'home', component: HomeComponent},
{path:'faq', component: FaqComponent},
{path:'contact', component: ContactComponent},
{path:'prints', component: PrintsComponent},
{path:'import-list', component: ImportListComponent},
{path:'download', component: DownloadComponent},
{path:'imageList', component: ImageListComponent},
{path:'dummy', component: DummyComponent},
{path:'loginAdminNinjartist', component: LoginComponent},
{path:'**', component: IntroComponent}


];

export const appRoutingProviders: any[] = [];
export const routing:ModuleWithProviders = RouterModule.forRoot(appRoutes);