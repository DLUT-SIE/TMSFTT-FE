import { Directive, Input } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import {
  MatBadgeModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlatformService } from './services/platform.service';
import { RouterLinkDirectiveStub } from '../testing/router-link-directive-stub';


describe('AppComponent', () => {
  const mockedPlatformService = { isMobile: false };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatBadgeModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [
        AppComponent,
        RouterLinkDirectiveStub,
      ],
      providers: [
        {
          provide: PlatformService,
          useValue: mockedPlatformService,
        },
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render long title in desktop platform', () => {
    const fixture = TestBed.createComponent(AppComponent);
    mockedPlatformService.isMobile = false;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('span.app-name').textContent).toContain(
      '大连理工大学专任教师教学培训管理系统');
  });

  it('should render short title in mobile platform', () => {
    const fixture = TestBed.createComponent(AppComponent);
    mockedPlatformService.isMobile = true;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('span.app-name').textContent).toContain(
      '教学培训管理系统');
  });

  it('should contain router links to other components', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const routerLinks = fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub))
      .map(de => de.injector.get(RouterLinkDirectiveStub));

      expect(routerLinks.length).toBe(2);
      expect(routerLinks[0].linkParams).toBe('/home');
      expect(routerLinks[1].linkParams).toBe('/training-record/entry/entry-mode');
  });
});
