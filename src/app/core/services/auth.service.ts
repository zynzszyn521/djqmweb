import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserModel } from '../model/user.model';

@Injectable()
export class AuthService {

    private readonly localStorageKey = 'isLoggedIn';
    private readonly localStorageUserCode = 'UserCode';
    private readonly localStorageUserName = 'UserName';
    private loginStatusSubject = new Subject<boolean>();

    get currentUserValue(): UserModel {
        debugger;
        var userModel = new UserModel();
        userModel.userCode = localStorage.getItem(this.localStorageUserCode);
        userModel.userName = localStorage.getItem(this.localStorageUserName);
        return userModel;
    }

    constructor(
        private userService: UserService,
        private message: NzMessageService,
    ) { }

    // 登录方法，假设登录成功时调用该方法
    login(userCode: string, password: string): Observable<boolean> {
        let postData = {
            userCode: userCode,
            password: password
        };
        this.userService.Login(postData).subscribe(data => {
            let res = data;
            if (res.successed) {
                if (res.data.length == 0) {
                    this.message.error('用户名或密码错误!');
                    this.loginStatusSubject.next(false);
                } else {
                    debugger;
                    localStorage.setItem(this.localStorageUserCode, res.data[0].userCode);
                    localStorage.setItem(this.localStorageUserName, res.data[0].userName);
                    sessionStorage.setItem(this.localStorageKey, 'true');
                    this.loginStatusSubject.next(true);
                }
            } else {
                localStorage.removeItem(this.localStorageKey);
                this.message.error(res.msg);
                this.loginStatusSubject.next(false);
            }
        }, (error: Error) => {
            this.message.error('请求发生错误!');
            console.log(error);
            this.loginStatusSubject.next(false);
        });
        return this.loginStatusSubject.asObservable();
    }

    // 登出方法，假设用户退出登录时调用该方法
    logout() {
        localStorage.removeItem(this.localStorageUserCode);
        localStorage.removeItem(this.localStorageUserName);
        sessionStorage.removeItem(this.localStorageKey);
    }

    // 检查用户是否已登录的方法
    isLoggedIn(): boolean {
        const isLoggedInString = sessionStorage.getItem(this.localStorageKey);
        // 将字符串转换为布尔值并返回
        return isLoggedInString ? JSON.parse(isLoggedInString) : false;
    }
}
