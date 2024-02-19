import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { fnCheckForm } from 'src/app/core/utils/tools';

export enum LoginType {
  Normal,
  Phone,
  Qr,
  Register
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  validateForm!: FormGroup;
  passwordVisible = false;
  password?: string;
  typeEnum = LoginType;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [null]
    });
  }

  submitForm(): void {
    // 校验表单
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    const param = this.validateForm.getRawValue();
    this.loading = true;
    this.authService.login(param.userName, param.password).subscribe(
      loggedIn => {
        this.loading = false;
        if (loggedIn) {
          this.router.navigateByUrl('/');
        }
      }
    );
  }
}