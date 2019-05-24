import { TestBed, inject } from '@angular/core/testing';

import { SchoolAdminGuard } from './school-admin.guard';
import { AUTH_SERVICE } from '../interfaces/auth-service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('SchoolAdminGuard', () => {
  let navigate: jasmine.Spy;
  let authService: {
    isAuthenticated: boolean,
    isDepartmentAdmin: boolean,
    isSchoolAdmin: boolean,
  };

  beforeEach(() => {
    navigate = jasmine.createSpy('navigate');
    TestBed.configureTestingModule({
      providers: [
        SchoolAdminGuard,
        {
          provide: AUTH_SERVICE,
          useValue: {
            isAuthenticated: false,
            isDepartmentAdmin: false,
            isSchoolAdmin: false,
          },
        },
        {
          provide: Router,
          useValue: { navigate },
        },
      ]
    });

    authService = TestBed.get(AUTH_SERVICE);
  });

  it('should create.', inject([SchoolAdminGuard], (guard: SchoolAdminGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should not activate if authentication failed', inject([SchoolAdminGuard], (guard: SchoolAdminGuard) => {
    authService.isAuthenticated = false;
    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      { url: '/abc' } as RouterStateSnapshot);

    expect(navigate).toHaveBeenCalledWith(['/auth/login'], { queryParams: { next: '/abc' }});
    expect(canActivate).toBeFalsy();
  }));

  it('should not activate if authentication succeed but is not school admin', inject([SchoolAdminGuard], (guard: SchoolAdminGuard) => {
    authService.isAuthenticated = true;
    authService.isDepartmentAdmin = true;
    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot);

    expect(navigate).toHaveBeenCalledWith(['/permission-denied']);
    expect(canActivate).toBeFalsy();
  }));

  it('should activate if authentication succeed and is school admin', inject([SchoolAdminGuard], (guard: SchoolAdminGuard) => {
    authService.isAuthenticated = true;
    authService.isSchoolAdmin = true;
    const canActivate = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot);

    expect(canActivate).toBeTruthy();
  }));
});
