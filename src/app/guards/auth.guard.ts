import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, } from '@angular/router';

import { AUTH_SERVICE, AuthService } from 'src/app/interfaces/auth-service';

/** AuthGuard requires authenticated access. */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService) { }

  /** Only if user is authenticated, then the component can be activated. */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    const isAuthenticated = this.authService.isAuthenticated;
    if (isAuthenticated) return true;
    this.router.navigate(['/auth/login'], {
      queryParams: {
        next: state.url,
      },
    });
    return false;
  }
}
