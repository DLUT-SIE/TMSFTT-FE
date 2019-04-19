import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, CanActivateChild, Route } from '@angular/router';

import { AUTH_SERVICE, AuthService } from 'src/app/shared/interfaces/auth-service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanLoad, CanActivateChild {

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService) { }

  private checkAdmin(url: string) {
    const isAuthenticated = this.authService.isAuthenticated;
    const isAdmin = this.authService.isSchoolAdmin || this.authService.isDepartmentAdmin;

    if (isAuthenticated && isAdmin) return true;

    if (!isAuthenticated) {
      this.router.navigate(['/auth/login'], {
        queryParams: {
          next: url,
        },
      });
    } else {
      this.router.navigate(['/permission-denied']);
    }
    return false;
  }

  /** Only if user is admin, then the component can be activated. */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    return this.checkAdmin(state.url);
  }

  /** Only if user is admin, then the module can be loaded. */
  canLoad(route: Route): boolean {
    return this.checkAdmin(this.location.path());
  }

  /** Only if user is admin, then the child components can be activated. */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkAdmin(state.url);
  }
}
