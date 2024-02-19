import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { VipListComponent } from './vip-list/vip-list.component';
import { UserNoteComponent } from './user-note/user-note.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { VipPriceManagerComponent } from './vip-price-manager/vip-price-manager.component';
import { VideoManagerComponent } from './video-manager/video-manager.component';
import { ArticleManagerComponent } from './article-manager/article-manager.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    data: { shouldDetach: 'no' },
    component: PagesComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/welcome' },
      { path: 'welcome', component: WelcomeComponent },
      { path: 'vip-list', component: VipListComponent },
      { path: 'user-note', component: UserNoteComponent },
      { path: 'user-manager', component: UserManagerComponent },
      { path: 'vip-price-manager', component: VipPriceManagerComponent },
      { path: 'video-manager', component: VideoManagerComponent },
      { path: 'article-manager', component: ArticleManagerComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
