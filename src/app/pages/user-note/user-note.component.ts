import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CodeInfoService } from 'src/app/core/services/code-info.service';
import { UserNoteService } from 'src/app/core/services/user-note.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-note',
  templateUrl: './user-note.component.html',
  styleUrls: ['./user-note.component.css']
})
export class UserNoteComponent {
  loading: boolean = false;
  loginUser: string = '';

  appCodeList: any = [];
  selectedAppCode: string = '';
  userCode: string = '';
  userNoteList: any = [];

  constructor(
    private userNoteService: UserNoteService,
    private userService: UserService,
    private codeInfoService: CodeInfoService,
    private message: NzMessageService,
  ) {

  }

  ngOnInit(): void {
    this.getCodeInfo();
  }

  getCodeInfo() {
    this.codeInfoService.GetCodeInfoList('appCode').subscribe(data => {
      let res = data;
      if (res.successed) {
        this.appCodeList = res.data;
      }
    }, (error: Error) => {
      console.log(error);
    });
  }

  queryClick() {
    this.loading = true;
    this.userNoteList = [];
    debugger;
    this.selectedAppCode = this.selectedAppCode ?? '';
    this.userNoteService.GetUserNote(this.userCode, this.selectedAppCode).subscribe(data => {
      this.loading = false;
      let res = data;
      if (res.successed) {
        this.userNoteList = res.data;
      } else {
        this.message.error(res.msg);
      }
    }, (error: Error) => {
      this.loading = false;
      this.message.error('请求发生错误!');
      console.log(error);
    });
  }

  userCodeSortFn(a: any, b: any) {
    return a.userCode.localeCompare(b.userCode);
  }
  appCodeSortFn(a: any, b: any) {
    return a.appCode.localeCompare(b.appCode);
  }
  noteDateSortFn(a: any, b: any) {
    debugger;
    if (a.noteDate ?? new Date() < b.noteDate ?? new Date()) {
      return -1;
    } else if (a.noteDate ?? new Date() > b.noteDate ?? new Date()) {
      return 1;
    } else {
      return 0;
    }
  }
  updateTimeSortFn(a: any, b: any) {
    debugger;
    if (a.updateTime ?? new Date() < b.updateTime ?? new Date()) {
      return -1;
    } else if (a.updateTime ?? new Date() > b.updateTime ?? new Date()) {
      return 1;
    } else {
      return 0;
    }
  }
}
