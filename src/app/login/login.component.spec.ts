import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatProgressBarModule } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';

import { LoginComponent } from './login.component';
import { RouterLinkDirectiveStub } from '../../testing/router-link-directive-stub';
import { AUTH_SERVICE } from '../services/auth/auth-service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let navigate: jasmine.Spy;
  let login: jasmine.Spy;
  let retrieveJWT: jasmine.Spy;
  let verifyJWT: jasmine.Spy;
  let refreshJWT: jasmine.Spy;
  const queryParamMapGet = jasmine.createSpy();
  const retrieveJWT$ = new Subject<boolean>();
  const verifyJWT$ = new Subject<boolean>();
  const refreshJWT$ = new Subject<boolean>();

  beforeEach(async(() => {
    navigate = jasmine.createSpy('navigate');
    const authService = jasmine.createSpyObj('AuthService',
      ['login', 'verifyJWT', 'refreshJWT', 'retrieveJWT']);
    login = authService.login;
    verifyJWT = authService.verifyJWT.and.returnValue(verifyJWT$);
    refreshJWT = authService.refreshJWT.and.returnValue(refreshJWT$);
    retrieveJWT = authService.retrieveJWT.and.returnValue(retrieveJWT$);

    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatProgressBarModule,
        RouterTestingModule,
      ],
      declarations: [
        LoginComponent,
        RouterLinkDirectiveStub,
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: authService,
        },
        {
          provide: Router,
          useValue: { navigate }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: queryParamMapGet,
              }
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.loginStatus).toBe(component.LoginStatus.VERIFYING_JWT);
  });

  it('should redirect to home if JWT is valid', () => {
    verifyJWT$.next(true);

    expect(navigate).toHaveBeenCalledWith(['/home']);
    expect(component.loginStatus).toBe(component.LoginStatus.REDIRECTING_TO_HOME);
  });

  it('should redirect to CAS if no ticket or no serviceURL', () => {
    queryParamMapGet.and.returnValues('ticket', null);
    verifyJWT$.next(false);

    expect(login).toHaveBeenCalled();
    expect(component.loginStatus).toBe(component.LoginStatus.REDIRECTING_TO_CAS);
  });

  it('should call retrieveJWT if ticket and serviceURL are presented', () => {
    queryParamMapGet.and.returnValues('ticket', 'service url');
    verifyJWT$.next(false);

    expect(component.loginStatus).toBe(component.LoginStatus.VERIFYING_CAS_TICKET);
    expect(retrieveJWT).toHaveBeenCalledWith('ticket', 'service url');
  });

  it('should not proceed if ticket is invalid', () => {
    queryParamMapGet.and.returnValues('invalid', 'service url');
    verifyJWT$.next(false);
    retrieveJWT$.next(false);

    expect(component.loginStatus).toBe(component.LoginStatus.INVALID_CAS_TICKET);
  });

  it('should redirect if ticket is valid', () => {
    queryParamMapGet.and.returnValues('key', 'service url');
    verifyJWT$.next(false);
    retrieveJWT$.next(true);

    expect(component.loginStatus).toBe(component.LoginStatus.REDIRECTING_TO_HOME);
    expect(navigate).toHaveBeenCalledWith(['/home']);
  });


});
