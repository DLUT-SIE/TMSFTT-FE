import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AUTH_SERVICE } from '../services/auth/auth-service';

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
        }
      ]
    });

    authService = TestBed.get(AUTH_SERVICE);
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should not activate if authentication failed', inject([AuthGuard], (guard: AuthGuard) => {
    authService.isAuthenticated = false;
    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot);

    expect(navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(canActivate).toBeFalsy();
  }));

  it('should activate if authentication succeed', inject([AuthGuard], (guard: AuthGuard) => {
    authService.isAuthenticated = true;
    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot);

    expect(canActivate).toBeTruthy();
  }));

});
