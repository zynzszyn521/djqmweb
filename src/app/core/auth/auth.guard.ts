import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, CanActivate, CanActivateFn, } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})
class PermissionsService {

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
		if (this.authService.isLoggedIn()) {
			return true;
		} else {
			// 如果用户未登录，重定向到登录页面
			return this.router.parseUrl('/login');
		}
	}
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
	return inject(PermissionsService).canActivate(next, state);
}