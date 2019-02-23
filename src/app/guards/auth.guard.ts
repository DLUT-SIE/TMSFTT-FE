import { Injectable, Inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad,
  CanActivateChild,
  Route,
} from '@angular/router';

import { AUTH_SERVICE, AuthService } from 'src/app/interfaces/auth-service';
import { Location } from '@angular/common';

/** AuthGuard requires authenticated access. */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService) { }

  private checkLogin(url: string) {
    if (this.authService.isAuthenticated) return true;
    this.router.navigate(['/auth/login'], {
      queryParams: {
        next: url,
      },
    });
    return false;
  }

  /** Only if user is authenticated, then the component can be activated. */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    return this.checkLogin(state.url);
  }

  /** Only if user is authenticated, then the module can be loaded. */
  canLoad(route: Route): boolean {
    return this.checkLogin(this.location.path());
  }

  /** Only if user is authenticated, then the child components can be activated. */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkLogin(state.url);
  }
}
