import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { MatBadgeModule } from '@angular/material';

import { SidebarComponent } from './sidebar.component';
import { PlatformService } from 'src/app/services/platform.service';
import { AUTH_SERVICE, AuthService } from 'src/app/interfaces/auth-service';
import { NotificationService } from 'src/app/modules/notification/services/notification.service';
import { RecordService } from 'src/app/modules/training-record/services/record.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authService: AuthService;
  const authenticationSucceed$ = new Subject<void>();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        RouterTestingModule,
        MatBadgeModule,
      ],
      declarations: [
        SidebarComponent,
      ],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            unreadNotifications: [],
          },
        },
        {
          provide: PlatformService,
          useValue: {
            isMobile: true,
          },
        },
        {
          provide: RecordService,
          useValue: {
            numberOfRecordsWithoutFeedback: 10,
          },
        },
        {
          provide: AUTH_SERVICE,
          useValue: {
            isAuthenticated: false,
            authenticationSucceed: authenticationSucceed$,
            isAdmin: false,
          },
        },
      ]
    })
    .compileComponents();

    authService = TestBed.get(AUTH_SERVICE);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display regular user nav menu if user is not authenticated.', () => {
    const nativeElement = fixture.debugElement.nativeElement as HTMLElement;
    const navMenu = nativeElement.querySelector('.regular-user-nav-menu');

    expect(navMenu).toBeNull();
  });

  it('should display regular user nav menu if user is authenticated.', () => {
    authService.isAuthenticated = true;
    fixture.detectChanges();
    const nativeElement = fixture.debugElement.nativeElement as HTMLElement;
    const navMenu = nativeElement.querySelector('.regular-user-nav-menu');

    expect(navMenu).not.toBeNull();
  });

  it('should not display admin nav menu if user is not admin.', () => {
    const nativeElement = fixture.debugElement.nativeElement as HTMLElement;
    const navMenu = nativeElement.querySelector('.admin-nav-menu');

    expect(navMenu).toBeNull();
  });

  it('should display admin nav menu if user is admin.', () => {
    authService.isDepartmentAdmin = true;
    fixture.detectChanges();
    const nativeElement = fixture.debugElement.nativeElement as HTMLElement;
    const navMenu = nativeElement.querySelector('.admin-nav-menu');

    expect(navMenu).not.toBeNull();
  });

});
