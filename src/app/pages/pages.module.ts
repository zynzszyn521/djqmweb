import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AppService } from 'src/app/core/services/app.service';
import { VipListComponent } from './vip-list/vip-list.component';
import { UserNoteComponent } from './user-note/user-note.component';
import { ArticleManagerComponent } from './article-manager/article-manager.component';
import { UserService } from '../core/services/user.service';
import { CodeInfoService } from '../core/services/code-info.service';
import { ArticleService } from '../core/services/article.service';
import { UserNoteService } from '../core/services/user-note.service';
import { FileTempService } from '../core/services/file-temp.service';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { QuillModule } from 'ngx-quill';
import { RouterModule, Routes } from '@angular/router';
import { PagesRoutingModule } from './pages-routing.module';
import { AuthService } from '../core/services/auth.service';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  declarations: [
    PagesComponent,
    VipListComponent,
    UserNoteComponent,
    ArticleManagerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PagesRoutingModule,
    NzLayoutModule,
    NzFormModule,
    NzGridModule,
    NzMenuModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzMessageModule,
    NzTagModule,
    NzSelectModule,
    NzModalModule,
    NzUploadModule,
    NzSpinModule,
    IconsProviderModule,
    NzIconModule.forRoot(icons),
    QuillModule.forRoot(),
  ],
  providers: [
    AppService,
    UserService,
    AuthService,
    CodeInfoService,
    UserNoteService,
    ArticleService,
    FileTempService,
  ]
})
export class PagesModule { }
