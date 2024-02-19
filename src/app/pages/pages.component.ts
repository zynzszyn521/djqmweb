import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pages-root',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent {
  loginUserName: string | null = 'User';
  isCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginUserName = this.authService.currentUserValue.userName;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
