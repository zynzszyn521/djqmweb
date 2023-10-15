import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable()
export class AppService {

    private headers: any;
    private options: any;
    constructor(private http: HttpClient,) {
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' });
        this.options = { headers: this.headers };
    }

    public GetAppServerVersion(appName: string): Observable<any> {
        let par = '/api/App/GetAppServerVersion?appName=' + appName;
        return this.http.get(environment.apiUrl + par);
    }

    public SaveNfcIdBind(postData: any): Observable<any> {
        let par = '/api/User/SaveNfcIdBind';
        return this.http.post(environment.apiUrl + par, postData, this.options);
    }
}
