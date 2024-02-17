import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable()
export class CodeInfoService {

    private headers: any;
    private options: any;
    constructor(private http: HttpClient,) {
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' });
        this.options = { headers: this.headers };
    }

    public GetCodeInfoList(codeGroup: string): Observable<any> {
        let par = '/api/CodeInfo/GetCodeInfoList?codeGroup=' + codeGroup;
        return this.http.get(environment.apiUrl + par);
    }
}
