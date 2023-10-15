import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/core/services/app.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  isRunning: boolean = false;
  versionName: string = '';
  updateLog: string = '';

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit() {
    this.appService.GetAppServerVersion('DJQM').subscribe({
      complete: () => {
        // debugger;
      },
      error: () => { },
      next: (res: any) => {
        // debugger;
        this.isRunning = false;
        if (res) {
          this.versionName = res.data[0].versionName;
          this.updateLog = res.data[0].updateLog;
        }
      },
    });
  }
}