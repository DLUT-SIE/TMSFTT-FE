import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { LocalAuthService } from './local-auth.service';
import { WindowService } from 'src/app/services/window.service';
import { STORAGE_SERVICE } from 'src/app/interfaces/storage-service';

describe('LocalAuthService', () => {
  let redirect: jasmine.Spy;
  let getItem: jasmine.Spy;

  beforeEach(() => {
    const windowService = jasmine.createSpyObj('WindowService', ['redirect']);
    redirect = windowService.redirect.and.returnValue(null);
    const storageService = jasmine.createSpyObj(
      'StorageService', ['getItem', 'setItem']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
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

    getItem = storageService.getItem;
  });

  it('should be created', () => {
    const service: LocalAuthService = TestBed.get(LocalAuthService);
    expect(service).toBeTruthy();
  });

  it('should redirect', fakeAsync(() => {
    const service: LocalAuthService = TestBed.get(LocalAuthService);
    service.login();

    tick(1000);

    expect(redirect).toHaveBeenCalled();
  }));

  it('should return true if retrieveJWT succeed.', fakeAsync(() => {
    const service: LocalAuthService = TestBed.get(LocalAuthService);

    service.retrieveJWT('valid ticket', 'url').subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeTruthy();
    });

    tick(1000);
  }));

  it('should return false if retrieveJWT failed.', fakeAsync(() => {
    const service: LocalAuthService = TestBed.get(LocalAuthService);

    service.retrieveJWT('invalid', 'url').subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
    });

    tick(1000);
  }));

  it('should return true if verifyJWT succeed.', fakeAsync(() => {
    const service: LocalAuthService = TestBed.get(LocalAuthService);
    getItem.and.returnValue('token');
    let authenticationSucceedFired = false;

    service.verifyJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeTruthy();
    });
    service.authenticationSucceed.subscribe(() => {
      authenticationSucceedFired = true;
    });

    tick(1000);
    expect(authenticationSucceedFired).toBeTruthy();
  }));

  it('should return false if verifyJWT with no JWT.', fakeAsync(() => {
    const service: LocalAuthService = TestBed.get(LocalAuthService);
    getItem.and.returnValue(null);

    service.verifyJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
    });

    tick(1000);
  }));

  it('should return false if verifyJWT failed.', fakeAsync(() => {
    const service: LocalAuthService = TestBed.get(LocalAuthService);
    getItem.and.returnValue('invalid');

    service.verifyJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
    });

    tick(1000);
  }));

  it('should return true if refreshJWT succeed.', fakeAsync(() => {
    const service: LocalAuthService = TestBed.get(LocalAuthService);
    getItem.and.returnValue('token');

    service.refreshJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeTruthy();
    });

    tick(1000);
  }));

  it('should return false if refreshJWT with no JWT.', fakeAsync(() => {
    const service: LocalAuthService = TestBed.get(LocalAuthService);
    getItem.and.returnValue(null);

    service.refreshJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
    });

    tick(1000);
  }));

  it('should return false if refreshJWT failed.', fakeAsync(() => {
    const service: LocalAuthService = TestBed.get(LocalAuthService);
    getItem.and.returnValue('invalid');

    service.refreshJWT().subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBeFalsy();
    });

    tick(1000);
  }));
});
