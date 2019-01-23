import { Injectable, Inject } from '@angular/core';
import { CanLoad, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AUTH_SERVICE, AuthService } from '../interfaces/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanLoad {

  constructor(
    private readonly router: Router,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = this.authService.isAuthenticated;

    if (!isAuthenticated) this.router.navigate(['/auth/login']);

    // TODO(youchen): Check whether user is admin.

    return isAuthenticated;
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = this.authService.isAuthenticated;

    if (!isAuthenticated) this.router.navigate(['/auth/login']);

    // TODO(youchen): Check whether user is admin.

    return isAuthenticated;
  }
}
