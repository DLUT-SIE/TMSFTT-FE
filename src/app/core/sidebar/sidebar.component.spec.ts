import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { MatBadgeModule } from '@angular/material';

import { SidebarComponent } from './sidebar.component';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { AUTH_SERVICE, AuthService } from 'src/app/shared/interfaces/auth-service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { AppThemePickerDirectiveStub } from 'src/testing/app-theme-picker-stub';
import { TruncatePipe } from 'src/app/shared/pipes/truncate.pipe';

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
        AppThemePickerDirectiveStub,
        TruncatePipe,
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
    const navMenu = nativeElement.querySelector('.user-nav-menu');

    expect(navMenu).toBeNull();
  });

  it('should display regular user nav menu if user is authenticated.', () => {
    authService.isAuthenticated = true;
    fixture.detectChanges();
    const nativeElement = fixture.debugElement.nativeElement as HTMLElement;
    const navMenu = nativeElement.querySelector('.user-nav-menu');

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
