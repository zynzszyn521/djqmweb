import { Component, TemplateRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { ArticleService } from 'src/app/core/services/article.service';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments/environment.prod';
import { FileTempService } from 'src/app/core/services/file-temp.service';

@Component({
  selector: 'app-article-manager',
  templateUrl: './article-manager.component.html',
  styleUrls: ['./article-manager.component.css']
})
export class ArticleManagerComponent {
  loading: boolean = false;
  loginUser: string = '';

  articleTitle: string = '';
  articleList: any = [];
  articleDetail: any = {};
  actionType: string = '';
  fileList: NzUploadFile[] = [];

  modules: any = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['image']                         // link and image, video 比如说这里用不到 video 就可以把 video 去掉
    ],
  }

  beforeUpload = (file: any, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.message.error('只能上传jpeg/png格式图片!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.message.error('图片大小必须小于 2MB!');
        observer.complete();
        return;
      }
      this.fileList = [];
      const formData = new FormData();
      formData.append('files[]', file);
      formData.append('guid', this.articleDetail.articleId);
      this.fileTempService.UploadFileTemp(formData, 'Article', 'Header').subscribe(data => {
        this.loading = false;
        let res = data;
        if (res.successed) {
          this.message.success('图片暂存成功!');
          this.articleDetail.picUrl = res.msg;
          observer.next(true);
        } else {
          this.message.error(res.msg);
        }
        observer.complete();
        return;
      }, (error: Error) => {
        this.loading = false;
        this.message.error('请求发生错误!');
        console.log(error);
        observer.complete();
        return;
      });
    });

  constructor(
    private articleService: ArticleService,
    private fileTempService: FileTempService,
    private message: NzMessageService,
    private modalService: NzModalService,
  ) {

  }

  ngOnInit(): void {

  }

  queryClick() {
    this.loading = true;
    this.articleList = [];
    this.articleService.GetArticleList(this.articleTitle).subscribe(data => {
      this.loading = false;
      let res = data;
      if (res.successed) {
        this.articleList = res.data;
      } else {
        this.message.error(res.msg);
      }
    }, (error: Error) => {
      this.loading = false;
      this.message.error('请求发生错误!');
      console.log(error);
    });
  }

  newClick(tlArticleDetail: TemplateRef<{}>) {
    this.actionType = 'ADD';
    this.articleDetail = {};
    this.articleDetail.articleId = uuidv4();
    this.fileList = [];
    var modal = this.modalService.create({
      nzTitle: '文章详情',
      nzContent: tlArticleDetail,
      nzWidth: '80%',
      nzOkText: '保存',
      nzCancelText: '關閉',
      nzMaskClosable: false,
      nzOnOk: () => new Promise((resolve) => {
        return this.saveArticleDetail();
      })
    });
  }

  editArticleClick(tlArticleDetail: TemplateRef<{}>, row: any) {
    this.actionType = 'EDIT';
    this.articleDetail = {};
    this.articleService.GetArticleDetail(row.articleId).subscribe(data => {
      this.loading = false;
      let res = data;
      if (res.successed) {
        if (res.data.length > 0) {
          this.articleDetail = res.data[0];
          this.fileList = [];
          if (this.articleDetail.picUrl != null) {
            const parts = this.articleDetail.picUrl.split('/');
            const fileName = parts[parts.length - 1];
            const file: NzUploadFile = {
              uid: row.articleId, // 设置一个唯一的标识符
              name: fileName,
              url: environment.baseUrl + '/' + this.articleDetail.picUrl, // 图片的URL
              status: 'done', // 设置为 'done' 表示已上传完成
              size: 20546, // 图片的大小
              type: 'image/jpeg', // 图片的类型
            };
            this.fileList.push(file);
          }

          this.articleDetail.content = Buffer.from(this.articleDetail.content, 'base64').toString();
          var modal = this.modalService.create({
            nzTitle: '文章详情',
            nzContent: tlArticleDetail,
            nzWidth: '80%',
            nzOkText: '保存',
            nzCancelText: '關閉',
            nzMaskClosable: false,
            nzOnOk: () => this.saveArticleDetail()
          });
        }
      } else {
        this.message.error(res.msg);
      }
    }, (error: Error) => {
      this.loading = false;
      this.message.error('请求发生错误!');
      console.log(error);
    });
  }

  saveArticleDetail(): Promise<any> {
    return new Promise((resolve) => {
      if (this.articleDetail.title == null || this.articleDetail.title == '') {
        this.message.error('请输入标题!');
        return resolve(false);
      }
      if (this.articleDetail.content == null || this.articleDetail.content == '') {
        this.message.error('请输入内容!');
        return resolve(false);
      }
      if (this.fileList.length == 0) {
        this.message.error('请上传图片!');
        return resolve(false);
      }
      this.articleDetail.content = this.articleDetail.content.replaceAll('		', '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
      this.articleDetail.content = this.articleDetail.content.replaceAll('<img', '<img style="width: 100%;"');
      let postData = {
        actionType: this.actionType,
        picUrl: this.articleDetail.picUrl,
        articleId: this.articleDetail.articleId,
        title: this.articleDetail.title,
        content: Buffer.from(this.articleDetail.content).toString('base64'),
        author: this.loginUser,
      };
      this.loading = true;
      this.articleService.SaveArticle(postData).subscribe(data => {
        this.loading = false;
        let res = data;
        if (res.successed) {
          this.message.success('保存成功!');
          return resolve(true);
        } else {
          this.message.error(res.msg);
          return resolve(false);
        }
      }, (error: Error) => {
        this.loading = false;
        this.message.error('请求发生错误!');
        console.log(error);
        return resolve(false);
      });
    });
  }

  editorCreated(quill: any) {
    // const toolbar = quill.getModule('toolbar');
    // // 给工具栏的image功能添加自定义函数，注意this指向问题
    // toolbar.addHandler('image', this.imgFun.bind(this));
    // // 保存quill对象
    // this.editor = quill;
  }

  imgFun(): void {
    // // 计算用户选择的范围，可选是否要求焦点在编辑器上(如果focus为true，且焦点会一直在编辑器内，且不改变选区)。如果焦点不在编辑器上，将会返回null。
    // let index = this.editor.getSelection(true).index;
    // // 图片上传完成之后会返回图片的 URL 地址这时就可以往富文本插入一张图片
    // this.editor.insertEmbed(index, 'image', 'url');
  }

  createTimeSortFn(a: any, b: any) {
    debugger;
    if (a.createTime ?? new Date() < b.createTime ?? new Date()) {
      return -1;
    } else if (a.createTime ?? new Date() > b.createTime ?? new Date()) {
      return 1;
    } else {
      return 0;
    }
  }


  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        // this.getBase64(info.file!.originFileObj!, (img: string) => {
        //   this.loading = false;
        //   this.avatarUrl = img;
        // });
        break;
      case 'error':
        // this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }
}
