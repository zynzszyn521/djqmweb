import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable()
export class FileTempService {

    private headers: any;
    private options: any;
    constructor(private http: HttpClient,) {
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' });
        this.options = { headers: this.headers };
    }

    public UploadFileTemp(postData: any, funType: string, fileCode: string): Observable<any> {
        let par = '/api/FileTemp/UploadFileTemp?funType=' + funType + '&fileCode=' + fileCode;
        return this.http.post(environment.apiUrl + par, postData);
    }
}
