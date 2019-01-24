import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';

import { SidebarComponent } from './sidebar.component';
import { PlatformService } from 'src/app/services/platform.service';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';
import { NotificationService } from 'src/app/modules/notification/services/notification.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  const authenticationSucceed$ = new Subject<void>();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        RouterTestingModule,
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
          provide: AUTH_SERVICE,
          useValue: {
            authenticationSucceed: authenticationSucceed$,
          },
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load load ROUTES after authenticated.', () => {
    authenticationSucceed$.next();

    expect(component.menuItems.length).not.toBe(0);
  });
});
