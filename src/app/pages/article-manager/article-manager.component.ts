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
  quillModules: any;
  fileList: NzUploadFile[] = [];

  constructor(
    private articleService: ArticleService,
    private fileTempService: FileTempService,
    private message: NzMessageService,
    private modalService: NzModalService,
  ) {
    this.quillModules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // 加粗、斜体、下划线、删除线
        ['blockquote'],
        [{ 'header': 1 }, { 'header': 2 }],               // 标题1、标题2
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],   // 有序列表、无序列表
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
  }

  ngOnInit(): void {

  }

  // 上传图片到服务器
  uploadImage(quill: any) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.setAttribute('style', 'display: none');
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('files[]', file);
      formData.append('guid', this.articleDetail.articleId);
      debugger;
      this.fileTempService.UploadFileTemp(formData, 'Article', 'Detail').subscribe(data => {
        this.loading = false;
        let res = data;
        if (res.successed) {
          debugger;
          // 获取服务器返回的图片地址
          const imageUrl = environment.baseUrl + '/' + res.msg;
          // 在富文本编辑器中插入图片
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', imageUrl);
          this.articleDetail.content = quill.root.innerHTML;
        } else {
          this.message.error(res.msg);
        }
      }, (error: Error) => {
        this.loading = false;
        this.message.error('请求发生错误!');
        console.log(error);
      });
    };
    input.click();
  }
  initEditor(quill: any) {
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', () => {
      this.uploadImage(quill);
    });
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
      nzOnOk: () => this.saveArticleDetail()
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
              size: 0, // 图片的大小
              type: '', // 图片的类型
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
      debugger;
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
}
