import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { HTTPAuthService } from './http-auth.service';
import { WindowService } from '../window.service';
import { STORAGE_SERVICE } from '../storage/storage-service';


describe('HTTPAuthService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let redirect: jasmine.Spy;
  let getItem: jasmine.Spy;
  let setItem: jasmine.Spy;

  beforeEach(() => {
    const windowService = jasmine.createSpyObj(
      'WindowService', ['redirect']);
    redirect = windowService.redirect.and.returnValue(null);
    const storageService = jasmine.createSpyObj(
      'StorageService', ['getItem', 'setItem']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        {
          provide: WindowService,
          useValue: windowService,
        },
        {
          provide: STORAGE_SERVICE,
          useValue: storageService,
        },
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    getItem = storageService.getItem;
    setItem = storageService.setItem;
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
    service.login();

    tick(500);

    expect(redirect).toHaveBeenCalled();
  }));

  it('should return true when retriveJWT succeed', fakeAsync(() => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);

    service.retrieveJWT('ticket', 'service').subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeTruthy();
      expect(setItem).toHaveBeenCalled();
    });

    const req = httpTestingController.expectOne(environment.CAS_VERIFY_URL);

    expect(req.request.method).toEqual('POST');
    req.flush({
      'token': 'token',
    });
  }));

  it('should return false when retriveJWT failed', fakeAsync(() => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);

    service.retrieveJWT('ticket', 'service').subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
      expect(setItem).not.toHaveBeenCalled();
    });

    const req = httpTestingController.expectOne(environment.CAS_VERIFY_URL);

    expect(req.request.method).toEqual('POST');
    req.flush({ 'msg': 'invalid' }, { status: 400 , statusText: 'failed' });
  }));

  it('should return true when verifyJWT succeed', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    getItem.and.returnValue('tokenefg');

    service.verifyJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeTruthy();
    });

    const req = httpTestingController.expectOne(environment.JWT_VERIFY_URL);
    expect(req.request.method).toEqual('POST');

    req.flush({
      'token': 'token',
    });
  });

  it('should return false when verifyJWT with no JWT', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    getItem.and.returnValue(null);

    service.verifyJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
    });
  });

  it('should return false when verifyJWT failed', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    getItem.and.returnValue('token');

    service.verifyJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
    });

    const req = httpTestingController.expectOne(environment.JWT_VERIFY_URL);

    expect(req.request.method).toEqual('POST');
    req.flush({ 'msg': 'invalid' }, { status: 400 , statusText: 'failed' });
  });

  it('should return true when refreshJWT succeed', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    getItem.and.returnValue('token');

    service.refreshJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeTruthy();
    });

    const req = httpTestingController.expectOne(environment.JWT_REFRESH_URL);

    expect(req.request.method).toEqual('POST');
    req.flush({
      'token': 'token',
    });
  });

  it('should return false when refreshJWT with no JWT', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    getItem.and.returnValue(null);

    service.refreshJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
    });
  });

  it('should return false when refreshJWT failed', () => {
    const service: HTTPAuthService = TestBed.get(HTTPAuthService);
    getItem.and.returnValue('token');

    service.refreshJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
    });

    const req = httpTestingController.expectOne(environment.JWT_REFRESH_URL);

    expect(req.request.method).toEqual('POST');
    req.flush({ 'msg': 'invalid' }, { status: 400 , statusText: 'failed' });
  });
});
