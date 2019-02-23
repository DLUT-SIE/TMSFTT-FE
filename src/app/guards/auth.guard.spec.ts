import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';
import { Location } from '@angular/common';

describe('AuthGuard', () => {
  let navigate: jasmine.Spy;
  let authService: {
    isAuthenticated: boolean,
  };

  beforeEach(() => {
    navigate = jasmine.createSpy('navigate');
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        {
          provide: AUTH_SERVICE,
          useValue: {
            isAuthenticated: false,
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
      ],
    });

    authService = TestBed.get(AUTH_SERVICE);
  });

  it('should create.', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should not activate if authentication failed.', inject([AuthGuard], (guard: AuthGuard) => {
    authService.isAuthenticated = false;
    const state = { url: '/abc' };
    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      state as RouterStateSnapshot);

    expect(navigate).toHaveBeenCalledWith(['/auth/login'], { queryParams: { next: '/abc' } });
    expect(canActivate).toBeFalsy();
  }));

  it('should activate if authentication succeed.', inject([AuthGuard], (guard: AuthGuard) => {
    authService.isAuthenticated = true;
    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot);

    expect(canActivate).toBeTruthy();
  }));

  it('should load if authentication succeed.', inject([AuthGuard], (guard: AuthGuard) => {
    authService.isAuthenticated = true;
    const canLoad = guard.canLoad({});

    expect(canLoad).toBeTruthy();
  }));

  it('should not load if authentication failed.', inject([AuthGuard], (guard: AuthGuard) => {
    authService.isAuthenticated = false;
    const canLoad = guard.canLoad({});

    expect(navigate).toHaveBeenCalledWith(['/auth/login'], { queryParams: { next: '/redirect-url' } });
    expect(canLoad).toBeFalsy();
  }));

  it('should not activate child if authentication failed.', inject([AuthGuard], (guard: AuthGuard) => {
    authService.isAuthenticated = false;
    const state = { url: '/abc' };
    const canActivateChild = guard.canActivateChild(
      {} as ActivatedRouteSnapshot,
      state as RouterStateSnapshot);

    expect(navigate).toHaveBeenCalledWith(['/auth/login'], { queryParams: { next: '/abc' } });
    expect(canActivateChild).toBeFalsy();
  }));

  it('should activate child if authentication succeed.', inject([AuthGuard], (guard: AuthGuard) => {
    authService.isAuthenticated = true;
    const canActivateChild = guard.canActivateChild(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot);

    expect(canActivateChild).toBeTruthy();
  }));
});
