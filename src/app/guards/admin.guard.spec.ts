import { TestBed, inject } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AdminGuard } from './admin.guard';
import { AUTH_SERVICE } from '../interfaces/auth-service';

describe('AdminGuard', () => {
  let navigate: jasmine.Spy;
  let authService: {
    isAuthenticated: boolean,
    isAdmin: boolean,
  };

  beforeEach(() => {
    navigate = jasmine.createSpy('navigate');
    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        {
          provide: AUTH_SERVICE,
          useValue: {
            isAuthenticated: false,
            isAdmin: false,
          },
        },
        {
          provide: Router,
          useValue: { navigate },
        }
      ]
    });

    authService = TestBed.get(AUTH_SERVICE);
  });

  it('should ...', inject([AdminGuard], (guard: AdminGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should not activate if authentication failed', inject([AdminGuard], (guard: AdminGuard) => {
    authService.isAuthenticated = false;
    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      { url: '/abc' } as RouterStateSnapshot);

    expect(navigate).toHaveBeenCalledWith(['/auth/login'], { queryParams: { next: '/abc' }});
    expect(canActivate).toBeFalsy();
  }));

  it('should not activate if authentication succeed but is not admin', inject([AdminGuard], (guard: AdminGuard) => {
    authService.isAuthenticated = true;
    authService.isAdmin = false;
    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot);

    expect(navigate).toHaveBeenCalledWith(['/permission-denied']);
    expect(canActivate).toBeFalsy();
  }));

  it('should activate if authentication succeed and is admin', inject([AdminGuard], (guard: AdminGuard) => {
    authService.isAuthenticated = true;
    authService.isAdmin = true;
    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot);

    expect(canActivate).toBeTruthy();
  }));

});
