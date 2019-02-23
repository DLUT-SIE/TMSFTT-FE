import { TestBed, inject } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AdminGuard } from './admin.guard';
import { AUTH_SERVICE } from '../interfaces/auth-service';
import { Location } from '@angular/common';

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
        },
        {
          provide: Location,
          useValue: {
            path: () => '/redirect-url',
          },
        },
      ]
    });

    authService = TestBed.get(AUTH_SERVICE);
  });

  it('should create.', inject([AdminGuard], (guard: AdminGuard) => {
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

  it('should load if authentication succeed and is admin', inject([AdminGuard], (guard: AdminGuard) => {
    authService.isAuthenticated = true;
    authService.isAdmin = true;
    const canLoad = guard.canLoad({});

    expect(canLoad).toBeTruthy();
  }));

  it('should not load if is not admin', inject([AdminGuard], (guard: AdminGuard) => {
    authService.isAuthenticated = true;
    authService.isAdmin = false;
    const canLoad = guard.canLoad({});

    expect(navigate).toHaveBeenCalledWith(['/permission-denied']);
    expect(canLoad).toBeFalsy();
  }));

  it('should not load if autentication failed', inject([AdminGuard], (guard: AdminGuard) => {
    authService.isAuthenticated = false;
    const canLoad = guard.canLoad({});

    expect(navigate).toHaveBeenCalledWith(['/auth/login'], { queryParams: { next: '/redirect-url' }});
    expect(canLoad).toBeFalsy();
  }));

  it('should not activate child if authentication failed', inject([AdminGuard], (guard: AdminGuard) => {
    authService.isAuthenticated = false;
    const canActivateChild = guard.canActivateChild(
      {} as ActivatedRouteSnapshot,
      { url: '/abc' } as RouterStateSnapshot);

    expect(navigate).toHaveBeenCalledWith(['/auth/login'], { queryParams: { next: '/abc' }});
    expect(canActivateChild).toBeFalsy();
  }));

  it('should not activate child if authentication succeed but is not admin', inject([AdminGuard], (guard: AdminGuard) => {
    authService.isAuthenticated = true;
    authService.isAdmin = false;
    const canActivateChild = guard.canActivateChild(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot);

    expect(navigate).toHaveBeenCalledWith(['/permission-denied']);
    expect(canActivateChild).toBeFalsy();
  }));

  it('should activate child if authentication succeed and is admin', inject([AdminGuard], (guard: AdminGuard) => {
    authService.isAuthenticated = true;
    authService.isAdmin = true;
    const canActivateChild = guard.canActivateChild(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot);

    expect(canActivateChild).toBeTruthy();
  }));
});
