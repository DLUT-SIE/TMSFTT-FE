import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf, Subject } from 'rxjs';

import { AppComponent } from './app.component';
import { PlatformService } from './shared/services/platform.service';
import { RouterLinkDirectiveStub } from 'src/testing/router-link-directive-stub';
import { AUTH_SERVICE } from './shared/interfaces/auth-service';
import { WindowService } from './shared/services/window.service';
import { PlatformType } from './shared/enums/platform-type.enum';
import { StyleManager } from './shared/services/style-manager.service';

@Component({
  selector: 'app-sidebar',
  template: '<div class="sidebar-wrapper"></div>',
})
class StubAppSideBarComponent { }

@Component({
  selector: 'app-navbar',
  template: '',
})
class StubAppNavBarComponent { }

@Component({
  selector: 'app-footer',
  template: '',
})
class StubAppFooterComponent { }

@Component({
  selector: 'app-test-app-root',
  template: `<body><app-root></app-root></body>`,
})
class TestAppRootComponent {
  @ViewChild(AppComponent) app: AppComponent;
}

describe('AppComponent(Windows)', () => {
  let testComponent: TestAppRootComponent;
  let app: AppComponent;
  let fixture: ComponentFixture<TestAppRootComponent>;
  let scrollTo: jasmine.Spy;
  let matchMedia: jasmine.Spy;
  let events$: Subject<{}>;
  let platformService: {
    isMobile: boolean,
    platformType: PlatformType,
  };
  const location$ = new Subject<{}>();

  beforeEach(async(() => {
    events$ = new Subject<{}>();
    scrollTo = jasmine.createSpy();
    matchMedia = jasmine.createSpy();
    matchMedia.and.returnValue({ matches: true });
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [
        TestAppRootComponent,
        AppComponent,
        RouterLinkDirectiveStub,
        StubAppSideBarComponent,
        StubAppNavBarComponent,
        StubAppFooterComponent,
      ],
      providers: [
        {
          provide: PlatformService,
          useValue: {
            isMobile: false,
            platformType: PlatformType.WINDOWS,
          },
        },
        {
          provide: AUTH_SERVICE,
          useValue: {
            isAuthenticated: false,
          },
        },
        {
          provide: Location,
          useValue: location$,
        },
        {
          provide: StyleManager,
          useValue: {
            themeChanged: observableOf({name: 'indigo-pink'}),
          },
        },
        {
          provide: WindowService,
          useValue: {
            nativeWindow: {
              scrollY: 100,
              scrollTo,
              matchMedia,
            }
          },
        },
        {
          provide: Router,
          useValue: {
            events: events$,
          }
        }
      ],
    }).compileComponents();

    platformService = TestBed.get(PlatformService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAppRootComponent);
    testComponent = fixture.componentInstance;
    app = testComponent.app;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();

    // If we are on WINDOWS.
    expect(document.body.classList).toContain('perfect-scrollbar-on');
  });

  it('should set theme class', () => {
    const element = app.themeContainer.nativeElement as HTMLElement;
    expect(element.classList.contains('indigo-pink')).toBeTruthy();
  });

  it('should set y scroll to its previous position.', () => {
    const url = '/a/b/c';
    const otherUrl = '/a/b';
    const navigationEndEvent = new NavigationEnd(0, url, url);
    const navigationStartEvent = new NavigationStart(0, otherUrl);
    location$.next({ url });

    events$.next(navigationStartEvent);

    events$.next(navigationEndEvent);

    expect(scrollTo).toHaveBeenCalledWith(0, 100);

    events$.next(navigationEndEvent);

    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should skip if url equals to lastPoppedUrl.', () => {
    const url = '/a/b/c';
    const navigationStartEvent = new NavigationStart(0, url);
    location$.next({ url });

    events$.next(navigationStartEvent);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('should skip other navigation events.', () => {
    events$.next({});
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('should reset y position when navigation ended', () => {
    const url = '/a/b/c';
    const navigationEndEvent = new NavigationEnd(0, url, url);

    events$.next(navigationEndEvent);

    const mainPanel = document.querySelector('.main-panel') as HTMLElement;
    expect(mainPanel).not.toBeNull();
    expect(mainPanel.scrollTop).toBe(0);
    const sidebar = document.querySelector('.sidebar .sidebar-wrapper') as HTMLElement;
    expect(sidebar).not.toBeNull();
    expect(sidebar.scrollTop).toBe(0);
  });

  it('should create the app without perfect scrollbar (Mac).', () => {
    expect(app).toBeTruthy();
    platformService.platformType = PlatformType.MAC;

    document.body.className = '';

    app.ngOnInit();

    // If we are on Mac.
    expect(document.body.classList).not.toContain('perfect-scrollbar-on');
  });

  it('should not update perfect scrollbar (Mac).', () => {
    expect(app).toBeTruthy();
    platformService.platformType = PlatformType.MAC;

    app.ngAfterViewInit();
    // Expect nothing
  });
});
