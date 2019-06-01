import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { environment } from 'src/environments/environment';
import { JWTResponse } from '../interfaces/auth-service';
import { HTTPAuthService } from './http-auth.service';
import { WindowService } from 'src/app/shared/services/window.service';
import { STORAGE_SERVICE } from '../interfaces/storage-service';
import { CookieService } from 'ngx-cookie-service';


describe('HTTPAuthService', () => {
  let httpTestingController: HttpTestingController;
  let redirect: jasmine.Spy;
  let getItem: jasmine.Spy;
  let setItem: jasmine.Spy;
  let removeItem: jasmine.Spy;
  const dummyResponse: JWTResponse = {
    token: 'token',
    user: {
      id: 123,
      username: 'username',
      last_login: '2019-01-01',
      first_name: 'first_name',
      last_name: 'last_name',
      email: 'e@m.com',
      is_active: true,
      date_joined: '2019-01-01',
      is_school_admin: false,
      is_department_admin: false,
      is_teacher: true,
      department: 1,
      department_str: 'abc',
    },
  };

  beforeEach(() => {
    const windowService = jasmine.createSpyObj(
      'WindowService', ['redirect']);
    redirect = windowService.redirect.and.returnValue(null);
    const storageService = jasmine.createSpyObj(
      'StorageService', ['getItem', 'setItem', 'removeItem']);
    const cookieService = jasmine.createSpyObj(
      'CookieService', ['delete']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: WindowService,
          useValue: windowService,
        },
        {
          provide: STORAGE_SERVICE,
          useValue: storageService,
        },
        {
          provide: CookieService,
          useValue: cookieService,
        }
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    getItem = storageService.getItem;
    setItem = storageService.setItem;
    removeItem = storageService.removeItem;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    expect(service).toBeTruthy();
  });

  it('should redirect to CAS login', fakeAsync(() => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    const nextURL = '/abc/def';
    service.login(nextURL);

    tick(500);

    expect(redirect).toHaveBeenCalled();
  }));

  it('should redirect to CAS login (query params trimed)', fakeAsync(() => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    const nextURL = '/abc/def?abc=ddd';
    service.login(nextURL);

    tick(500);

    expect(redirect).toHaveBeenCalled();
  }));

  it('should return true when retriveJWT succeed', fakeAsync(() => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);

    service.retrieveJWT('ticket', 'service').subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeTruthy();
      expect(service.isAuthenticated).toBeTruthy();
      expect(setItem).toHaveBeenCalled();
    });

    const req = httpTestingController.expectOne(
      `/login/`);

    expect(req.request.method).toEqual('POST');
    req.flush(dummyResponse);
  }));

  it('should return false when retriveJWT failed', fakeAsync(() => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);

    service.retrieveJWT('ticket', 'service').subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
      expect(service.isAuthenticated).toBeFalsy();
      expect(setItem).not.toHaveBeenCalled();
    });

    const req = httpTestingController.expectOne(
      `/login/`);

    expect(req.request.method).toEqual('POST');
    req.flush({ msg: 'invalid' }, { status: 400, statusText: 'failed' });
  }));

  it('should return true when verifyJWT succeed', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    getItem.and.returnValue('tokenefg');
    let authenticationSucceedFired = false;

    service.verifyJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeTruthy();
      expect(service.isAuthenticated).toBeTruthy();
    });
    service.authenticationSucceed.subscribe(() => {
      authenticationSucceedFired = true;
    });

    const req = httpTestingController.expectOne(
      `/jwt-verify/`);
    expect(req.request.method).toEqual('POST');

    req.flush(dummyResponse);

    expect(authenticationSucceedFired).toBeTruthy();
  });

  it('should return true when verifyJWT succeed(no department name)', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    getItem.and.returnValue('tokenefg');
    let authenticationSucceedFired = false;

    service.verifyJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeTruthy();
      expect(service.isAuthenticated).toBeTruthy();
    });
    service.authenticationSucceed.subscribe(() => {
      authenticationSucceedFired = true;
    });

    const req = httpTestingController.expectOne(
      `/jwt-verify/`);
    expect(req.request.method).toEqual('POST');

    const dummyResponseWithoutDepartmentName: JWTResponse = {
      token: 'token',
      user: {
        id: 123,
        username: 'username',
        last_login: '2019-01-01',
        first_name: 'first_name',
        last_name: 'last_name',
        email: 'e@m.com',
        is_active: true,
        date_joined: '2019-01-01',
        is_school_admin: false,
        is_department_admin: false,
        is_teacher: true,
        department: 1,
      },
    };


    req.flush(dummyResponseWithoutDepartmentName);

    expect(authenticationSucceedFired).toBeTruthy();
  });


  it('should return false when verifyJWT with no JWT', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    getItem.and.returnValue(null);

    service.verifyJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
      expect(service.isAuthenticated).toBeFalsy();
    });
  });

  it('should return false when verifyJWT failed', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    getItem.and.returnValue('token');

    service.verifyJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
      expect(service.isAuthenticated).toBeFalsy();
    });

    const req = httpTestingController.expectOne(
      `/jwt-verify/`);

    expect(req.request.method).toEqual('POST');
    req.flush({ msg: 'invalid' }, { status: 400, statusText: 'failed' });
  });

  it('should return true when refreshJWT succeed', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    getItem.and.returnValue('token');

    service.refreshJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeTruthy();
      expect(service.isAuthenticated).toBeTruthy();
    });

    const req = httpTestingController.expectOne(
      `/jwt-refresh/`);

    expect(req.request.method).toEqual('POST');
    req.flush(dummyResponse);
  });

  it('should return false when refreshJWT with no JWT', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    getItem.and.returnValue(null);

    service.refreshJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
      expect(service.isAuthenticated).toBeFalsy();
    });
  });

  it('should return false when refreshJWT failed', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    getItem.and.returnValue('token');

    service.refreshJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
      expect(service.isAuthenticated).toBeFalsy();
    });

    const req = httpTestingController.expectOne(
      `/jwt-refresh/`);

    expect(req.request.method).toEqual('POST');
    req.flush({ msg: 'invalid' }, { status: 400, statusText: 'failed' });
  });

  it('should logout', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);

    service.logout();

    expect(removeItem).toHaveBeenCalledWith(environment.JWT_KEY);
  });
});
