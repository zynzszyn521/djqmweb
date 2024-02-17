import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { AppService } from './core/services/app.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { VipListComponent } from './pages/vip-list/vip-list.component';
import { UserService } from './core/services/user.service';
import { UserNoteComponent } from './pages/user-note/user-note.component';
import { CodeInfoService } from './core/services/code-info.service';
import { UserNoteService } from './core/services/user-note.service';
import { QuillModule } from 'ngx-quill';
import { ArticleManagerComponent } from './pages/article-manager/article-manager.component';
import { ArticleService } from './core/services/article.service';
import { FileTempService } from './core/services/file-temp.service';

registerLocaleData(zh);



const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  declarations: [
    AppComponent,
    VipListComponent,
    UserNoteComponent,
    ArticleManagerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
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
    NzIconModule.forRoot(icons),
    QuillModule.forRoot(),
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    AppService,
    UserService,
    CodeInfoService,
    UserNoteService,
    ArticleService,
    FileTempService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
