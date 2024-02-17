import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable()
export class ArticleService {

    private headers: any;
    private options: any;
    constructor(private http: HttpClient,) {
        this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' });
        this.options = { headers: this.headers };
    }

    public GetArticleList(title: string): Observable<any> {
        let par = '/api/Article/GetArticleList?title=' + title;
        return this.http.get(environment.apiUrl + par);
    }

    public GetArticleDetail(articleId: string): Observable<any> {
        let par = '/api/Article/GetArticleDetail?articleId=' + articleId;
        return this.http.get(environment.apiUrl + par);
    }

    public SaveArticle(postData: any): Observable<any> {
        let par = '/api/Article/SaveArticle';
        return this.http.post(environment.apiUrl + par, postData);
    }
}
