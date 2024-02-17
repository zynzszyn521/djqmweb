import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from 'src/app/core/services/user.service';

export interface UserData {
  id: number;
  name: string;
  age: number;
  address: string;
  disabled: boolean;
}

@Component({
  selector: 'app-vip-list',
  templateUrl: './vip-list.component.html',
  styleUrls: ['./vip-list.component.css']
})
export class VipListComponent {
  loading: boolean = false;
  loginUser: string = '';

  userCode: string = '';
  userList: any = [];

  constructor(
    private userService: UserService,
    private message: NzMessageService,
  ) {

  }

  ngOnInit(): void {

  }

  queryClick() {
    this.loading = true;
    this.userList = [];
    this.userService.GetUserList(this.userCode).subscribe(data => {
      this.loading = false;
      let res = data;
      if (res.successed) {
        this.userList = res.data;
      } else {
        this.message.error(res.msg);
      }
    }, (error: Error) => {
      this.loading = false;
      this.message.error('请求发生错误!');
      console.log(error);
      return false;
    });
  }
  GetVipFlagName(vipFlag: number) {
    var vipFlagName: String = '';
    switch (vipFlag) {
      case 0:
        vipFlagName = '否';
        break;
      case 1:
        vipFlagName = '是';
        break;
      default:
        break;
    }
    return vipFlagName;
  }

  vipFlagSortFn(a: any, b: any) {
    return a.vipFlag - b.vipFlag;
  }
  expirationTimeSortFn(a: any, b: any) {
    debugger;
    if (a.expirationTime ?? new Date() < b.expirationTime ?? new Date()) {
      return -1;
    } else if (a.expirationTime ?? new Date() > b.expirationTime ?? new Date()) {
      return 1;
    } else {
      return 0;
    }
  }
}
