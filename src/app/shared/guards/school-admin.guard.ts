import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AUTH_SERVICE, AuthService } from '../interfaces/auth-service';

@Injectable({
  providedIn: 'root'
})
export class SchoolAdminGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService) { }

  private checkAdmin(url: string) {
    const isAuthenticated = this.authService.isAuthenticated;
    const isSchoolAdmin = this.authService.isSchoolAdmin;

    if (isAuthenticated && isSchoolAdmin) return true;

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
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAdmin(state.url);
  }
}
