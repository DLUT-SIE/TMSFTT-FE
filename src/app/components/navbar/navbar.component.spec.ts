import { fakeAsync, async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';

import { NavbarComponent } from './navbar.component';
import { NotificationService } from 'src/app/modules/notification/services/notification.service';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';
import { WindowService } from 'src/app/services/window.service';

@Component({
  selector: '<app-test-navbar>',
  template: '<body><div class="main-panel"><app-navbar></app-navbar></div></body>',
})
class TestNavbarComponent {
  @ViewChild(NavbarComponent) navbar: NavbarComponent;
}

describe('NavbarComponent', () => {
  let testComponent: TestNavbarComponent;
  let component: NavbarComponent;
  let fixture: ComponentFixture<TestNavbarComponent>;
  let closeAll: jasmine.Spy;
  let open: jasmine.Spy;
  let prepareExternalUrl: jasmine.Spy;
  let removeJWT: jasmine.Spy;
  let redirect: jasmine.Spy;
  const events$ = new Subject<void>();
  const authenticationSucceed$ = new Subject<void>();

  beforeEach(async(() => {
    closeAll = jasmine.createSpy();
    open = jasmine.createSpy();
    removeJWT = jasmine.createSpy();
    redirect = jasmine.createSpy();
    prepareExternalUrl = jasmine.createSpy();
    prepareExternalUrl.and.returnValue('url');
    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        RouterTestingModule,
      ],
      declarations: [
        NavbarComponent,
        TestNavbarComponent,
      ],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            unreadNotifications: [],
          },
        },
        {
          provide: WindowService,
          useValue: {
            redirect,
          }
        },
        {
          provide: AUTH_SERVICE,
          useValue: {
            authenticationSucceed: authenticationSucceed$,
            removeJWT,
          }
        },
        {
          provide: Location,
          useValue: { path: jasmine.createSpy(), prepareExternalUrl, }
        },
        {
          provide: Router,
          useValue: {
            events: events$,
          },
        },
        {
          provide: MatDialog,
          useValue: { open, closeAll, }
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestNavbarComponent);
    testComponent = fixture.componentInstance;
    component = testComponent.navbar;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close navBar if event emitted.', () => {
    const closeNavbar = spyOn(component, 'closeNavbar');

    events$.next();

    expect(closeNavbar).toHaveBeenCalled();
  });

  it('should open navbar', fakeAsync(() => {
    component.openNavbar();

    tick(100);

    const mainPanel = document.getElementsByClassName('main-panel')[0];
    const shadingLayer = mainPanel.querySelector('.close-layer') as HTMLElement;
    expect(component.navbarToggled).toBeTruthy();
    expect(document.body.classList).toContain('nav-open');
    expect(shadingLayer).not.toBeNull();
    expect(shadingLayer.classList).toContain('visible');
  }));

  it('should not open navbar if it\'s already opened.', fakeAsync(() => {
    component.openNavbar();

    tick(100);

    component.openNavbar();

    tick(100);

    const shadingLayers = document.getElementsByClassName('close-layer');
    expect(shadingLayers.length).toBe(1);
  }));

  it('should close navbar', fakeAsync(() => {
    component.openNavbar();

    tick(100);

    const shadingLayer = document.querySelector('.close-layer') as HTMLElement;
    shadingLayer.click();

    expect(document.body.classList).not.toContain('nav-open');
    expect(shadingLayer.classList).not.toContain('visible');

    tick(400);

    expect(document.querySelector('.close-layer')).toBeNull();
    expect(component.navbarToggled).toBeFalsy();
  }));

  it('should get correct title', () => {
    authenticationSucceed$.next();
    prepareExternalUrl.and.returnValue('/dashboard');

    const title = component.getTitle();

    expect(title).toBe('首页');
  });

  it('should get correct title(slice url)', () => {
    authenticationSucceed$.next();
    prepareExternalUrl.and.returnValue('#x/dashboard');

    const title = component.getTitle();

    expect(title).toBe('首页');
  });

  it('should get default title', () => {
    authenticationSucceed$.next();
    prepareExternalUrl.and.returnValue('/not-exist');

    const title = component.getTitle();

    expect(title).toBe('教师培训管理系统');
  });

  it('should logout user', () => {
    component.logOut();

    expect(removeJWT).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalled();
  })

});
