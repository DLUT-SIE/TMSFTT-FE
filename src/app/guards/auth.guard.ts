import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AUTH_SERVICE, AuthService } from '../services/auth/auth-service';

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
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const isAuthenticated = this.authService.isAuthenticated;

    if (!isAuthenticated) this.router.navigate(['/auth/login']);

    return isAuthenticated;
  }
}
