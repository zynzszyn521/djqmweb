import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { VipListComponent } from './pages/vip-list/vip-list.component';
import { UserNoteComponent } from './pages/user-note/user-note.component';
import { UserManagerComponent } from './pages/user-manager/user-manager.component';
import { VipPriceManagerComponent } from './pages/vip-price-manager/vip-price-manager.component';
import { VideoManagerComponent } from './pages/video-manager/video-manager.component';
import { ArticleManagerComponent } from './pages/article-manager/article-manager.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'vip-list', component: VipListComponent },
  { path: 'user-note', component: UserNoteComponent },
  { path: 'user-manager', component: UserManagerComponent },
  { path: 'vip-price-manager', component: VipPriceManagerComponent },
  { path: 'video-manager', component: VideoManagerComponent },
  { path: 'article-manager', component: ArticleManagerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
