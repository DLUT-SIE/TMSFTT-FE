import { TestBed, inject } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AdminGuard } from './admin.guard';
import { AUTH_SERVICE } from '../interfaces/auth-service';

describe('AdminGuard', () => {
  let navigate: jasmine.Spy;
  let authService: {
    isAuthenticated: boolean,
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
      {} as RouterStateSnapshot);

    expect(navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(canActivate).toBeFalsy();
  }));

  it('should activate if authentication succeed', inject([AdminGuard], (guard: AdminGuard) => {
    authService.isAuthenticated = true;
    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot);

    expect(canActivate).toBeTruthy();
  }));

  it('should not load if user is not admin.', inject([AdminGuard], (guard: AdminGuard) => {
    authService.isAuthenticated = false;
    const canLoad = guard.canLoad({});

    expect(navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(canLoad).toBeFalsy();
  }));

  it('should load if user is admin.', inject([AdminGuard], (guard: AdminGuard) => {
    authService.isAuthenticated = true;
    const canLoad = guard.canLoad({});

    expect(canLoad).toBeTruthy();
  }));
});
