import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {

    private headers: any;
    private options: any;
    constructor(private http: HttpClient,) {
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' });
        this.options = { headers: this.headers };
    }

    public Login(postData): Observable<any> {
        let par = '/api/User/Login';
        return this.http.post(environment.apiUrl + par, postData);
    }

    public GetUserInfo(userCode: string): Observable<any> {
        let par = '/api/User/GetUserInfo?userCode=' + userCode;
        return this.http.get(environment.apiUrl + par);
    }

    public GetUserList(userCode: string): Observable<any> {
        let par = '/api/User/GetUserList?userCode=' + userCode;
        return this.http.get(environment.apiUrl + par);
    }
}
