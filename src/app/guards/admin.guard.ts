import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AUTH_SERVICE, AuthService } from '../interfaces/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    const isAuthenticated = this.authService.isAuthenticated;
    if (!isAuthenticated) {
      this.router.navigate(['/auth/login'], {
        queryParams: {
          next: state.url,
        },
      });
      return false;
    }
    const isAdmin = this.authService.isAdmin;
    if (isAdmin) return true;

    this.router.navigate(['/permission-denied']);
    return false;
  }
}
