import { Component, TemplateRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { v4 as uuidv4 } from 'uuid';
import { FileTempService } from 'src/app/core/services/file-temp.service';
import { VideoService } from 'src/app/core/services/video.service';

@Component({
  selector: 'app-video-manager',
  templateUrl: './video-manager.component.html',
  styleUrls: ['./video-manager.component.css']
})
export class VideoManagerComponent {
  loading: boolean = false;
  loginUser: string = '';

  videoTitle: string = '';
  videoList: any = [];
  videoDetail: any = {};
  actionType: string = '';
  fileList: NzUploadFile[] = [];

  constructor(
    private videoService: VideoService,
    private fileTempService: FileTempService,
    private message: NzMessageService,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit(): void {

  }

  queryClick() {
    this.loading = true;
    this.videoList = [];
    this.videoService.GetVideoList(this.videoTitle).subscribe(data => {
      this.loading = false;
      let res = data;
      if (res.successed) {
        this.videoList = res.data;
      } else {
        this.message.error(res.msg);
      }
    }, (error: Error) => {
      this.loading = false;
      this.message.error('请求发生错误!');
      console.log(error);
    });
  }

  newClick(tlVideoDetail: TemplateRef<{}>) {
    this.actionType = 'ADD';
    this.videoDetail = {};
    this.videoDetail.videoId = uuidv4();
    this.fileList = [];
    var modal = this.modalService.create({
      nzTitle: '文章详情',
      nzContent: tlVideoDetail,
      nzWidth: '80%',
      nzOkText: '保存',
      nzCancelText: '關閉',
      nzMaskClosable: false,
      nzOnOk: () => this.saveVideoDetail()
    });
  }

  editVideoClick(tlVideoDetail: TemplateRef<{}>, row: any) {
    this.actionType = 'EDIT';
    this.videoDetail = {};
    // this.videoService.GetVideoDetail(row.videoId).subscribe(data => {
    //   this.loading = false;
    //   let res = data;
    //   if (res.successed) {
    //     if (res.data.length > 0) {
    //       this.videoDetail = res.data[0];
    //       this.fileList = [];
    //       if (this.videoDetail.picUrl != null) {
    //         const parts = this.videoDetail.picUrl.split('/');
    //         const fileName = parts[parts.length - 1];
    //         const file: NzUploadFile = {
    //           uid: row.videoId, // 设置一个唯一的标识符
    //           name: fileName,
    //           url: environment.baseUrl + '/' + this.videoDetail.picUrl, // 图片的URL
    //           status: 'done', // 设置为 'done' 表示已上传完成
    //           size: 0, // 图片的大小
    //           type: '', // 图片的类型
    //         };
    //         this.fileList.push(file);
    //       }

    //       var modal = this.modalService.create({
    //         nzTitle: '文章详情',
    //         nzContent: tlVideoDetail,
    //         nzWidth: '80%',
    //         nzOkText: '保存',
    //         nzCancelText: '關閉',
    //         nzMaskClosable: false,
    //         nzOnOk: () => this.saveVideoDetail()
    //       });
    //     }
    //   } else {
    //     this.message.error(res.msg);
    //   }
    // }, (error: Error) => {
    //   this.loading = false;
    //   this.message.error('请求发生错误!');
    //   console.log(error);
    // });
  }

  saveVideoDetail(): Promise<any> {
    return new Promise((resolve) => {
      if (this.videoDetail.title == null || this.videoDetail.title == '') {
        this.message.error('请输入标题!');
        return resolve(false);
      }
      if (this.videoDetail.content == null || this.videoDetail.content == '') {
        this.message.error('请输入内容!');
        return resolve(false);
      }
      if (this.fileList.length == 0) {
        this.message.error('请上传图片!');
        return resolve(false);
      }
      debugger;
      let postData = {
        author: this.loginUser,
      };
      this.loading = true;
      // this.videoService.SaveVideo(postData).subscribe(data => {
      //   this.loading = false;
      //   let res = data;
      //   if (res.successed) {
      //     this.message.success('保存成功!');
      //     return resolve(true);
      //   } else {
      //     this.message.error(res.msg);
      //     return resolve(false);
      //   }
      // }, (error: Error) => {
      //   this.loading = false;
      //   this.message.error('请求发生错误!');
      //   console.log(error);
      //   return resolve(false);
      // });
    });
  }

  getRecommendFlagName(recommendFlag: number) {
    return recommendFlag == 1 ? '是' : '否';

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
