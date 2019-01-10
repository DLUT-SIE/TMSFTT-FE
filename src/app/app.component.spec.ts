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

import { AppComponent } from './app.component';
import { PlatformService } from './platform.service';


describe('AppComponent', () => {
  const mockedPlatformService = { isMobile: false };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        MatBadgeModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatSidenavModule,
        MatToolbarModule,
      ],
      declarations: [
        AppComponent,
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
});
