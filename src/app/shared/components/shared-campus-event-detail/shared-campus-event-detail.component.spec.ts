import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCampusEventDetailComponent } from './shared-campus-event-detail.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { EventDetailType } from '../../enums/event-detail-type.enum';
import {
  MatIconModule,
  MatInputModule,
  MatSnackBar,
  MatDividerModule,
} from '@angular/material';
 import { EventService } from 'src/app/shared/services/events/event.service';
 import { Enrollment } from 'src/app/shared/interfaces/enrollment';
 import { Subject } from 'rxjs';
import { AUTH_SERVICE } from '../../interfaces/auth-service';
import { DetailSectionComponent } from '../detail-section/detail-section.component';
import { DetailItemComponent } from '../detail-item/detail-item.component';
import { DetailItemTitleComponent } from '../detail-item-title/detail-item-title.component';
import { DetailItemContentComponent } from '../detail-item-content/detail-item-content.component';
import { DetailSectionActionsComponent } from '../detail-section-actions/detail-section-actions.component';
import { HttpErrorResponse } from '@angular/common/http';
import { WindowService } from 'src/app/shared/services/window.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SharedCampusEventDetailComponent', () => {
  let component: SharedCampusEventDetailComponent;
  let fixture: ComponentFixture<SharedCampusEventDetailComponent>;
  let navigate: jasmine.Spy;
  let bypassSecurityTrustHtml: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;
  let reviewCampusEvent: jasmine.Spy;
  let deleteEventEnrollment$: Subject<Enrollment>;
  let windowOpen: jasmine.Spy;
  let exportAttendanceSheet$ = new Subject<{'url': string}>();

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    deleteEventEnrollment$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    reviewCampusEvent = jasmine.createSpy();
    bypassSecurityTrustHtml = jasmine.createSpy().and.returnValue('abc');
    exportAttendanceSheet$ = new Subject<{'url': string}>();
    windowOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        SharedCampusEventDetailComponent,
        DetailSectionComponent,
        DetailItemComponent,
        DetailItemTitleComponent,
        DetailItemContentComponent,
        DetailSectionActionsComponent,
      ],
      imports: [
        MatIconModule,
        MatInputModule,
        MatDividerModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: {
          }
        },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml,
            sanitize: () => 'abc',
          },
        },
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {
            createUrlTree: () => 'abc',
            navigate,
          },
        },
        {
          provide: EventService,
          useValue: {
            deleteEventEnrollment: (id: number) => deleteEventEnrollment$,
            exportAttendanceSheet: () => exportAttendanceSheet$,
            reviewCampusEvent,
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          },
        },
        {
          provide: WindowService,
          useValue: {
            open: windowOpen,
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCampusEventDetailComponent);
    component = fixture.componentInstance;
    const event =  {
      id: 12,
      expired: true,
      enrolled: true,
      create_time: '2019-05-09T10:39:41.793039+08:0',
      update_time: '2019-05-10T09:10:48.370559+08:00',
      name: '1243124',
      time: '2020-05-01T00:24:00+08:00',
      location: '1233',
      num_hours: 312.0,
      num_participants: 123,
      deadline: '2020-02-01T03:23:00+08:00',
      num_enrolled: 123,
      description: '<p class="abc">abc</p>',
      program_detail: {
        id: 3,
        category_str: '教学培训',
        department: '大连理工大学',
        name: '教学基本功培训',
        category: 1
      },
      program: {
        id: 1,
        category_str: '青年教师助课',
        department: '飞海科技',
        name: '不过时候之间国际.',
        category: 4
      }
    };
    component.event = event;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to event form by admin', () => {
    component.eventDetailType = EventDetailType.ADMIN;
    component.navigateToChangeEvent();

    expect(navigate).toHaveBeenCalled();
  });

  it('should bypass sanitizing.', () => {
    const description = '<p class="abc">abc</p>';
    component.event.description = description;
    bypassSecurityTrustHtml.and.returnValue(description);

    expect(component.event.description).toBe(description);

    expect(bypassSecurityTrustHtml).toHaveBeenCalledWith(description);
  });

  it('should delete enrollment.', () => {
    const event =  {
      id: 12,
      expired: true,
      enrolled: true,
      create_time: '2019-05-09T10:39:41.793039+08:0',
      update_time: '2019-05-10T09:10:48.370559+08:00',
      name: '1243124',
      time: '2020-05-01T00:24:00+08:00',
      location: '1233',
      num_hours: 312.0,
      num_participants: 123,
      deadline: '2020-02-01T03:23:00+08:00',
      num_enrolled: 123,
      description: '<p class="abc">abc</p>',
      program_detail: {
        id: 3,
        category_str: '教学培训',
        department: '大连理工大学',
        name: '教学基本功培训',
        category: 1
      },
      program: {
        id: 1,
        category_str: '青年教师助课',
        department: '飞海科技',
        name: '不过时候之间国际.',
        category: 4
      }
    };
    component.event = event;
    component.deleteEnrollment();
    deleteEventEnrollment$.next();
    expect(snackBarOpen).toHaveBeenCalledWith('取消报名成功', '关闭');
    expect(navigate).toHaveBeenCalled();
  });

  it('should review campus event', () => {
    const event = {
      id: 12,
      reviewed: false
    };
    const reviewCampusEvent$ = new Subject<{}>();
    reviewCampusEvent.and.returnValue(reviewCampusEvent$);
    component.event = event;

    component.reviewCampusEvent();
    reviewCampusEvent$.next();

    expect(reviewCampusEvent).toHaveBeenCalledWith(event);
    expect(snackBarOpen).toHaveBeenCalled();
    expect(event.reviewed).toBeTruthy();
  });

  it('should review campus event (failed)', () => {
    const event = {
      id: 12,
      reviewed: false
    };
    const reviewCampusEvent$ = new Subject<{}>();
    reviewCampusEvent.and.returnValue(reviewCampusEvent$);
    component.event = event;

    component.reviewCampusEvent();
    reviewCampusEvent$.error({});

    expect(reviewCampusEvent).toHaveBeenCalledWith(event);
    expect(snackBarOpen).toHaveBeenCalled();
    expect(event.reviewed).toBeFalsy();
  });

  it('should build url', () => {

    const url: string = component.buildUrl(1);

    expect(url).toEqual(
      `/aggregate-data/table-export/?table_type=9&event_id=1`);
  });

  it('should load data', () => {
    const buildUrl = spyOn(component, 'buildUrl');
    buildUrl.and.returnValue('123');
    component.doResultsExport(1);
    exportAttendanceSheet$.next({
      url: '/path/to/file',
    } as {url: string});
    expect(buildUrl).toHaveBeenCalled();
    expect(windowOpen).toHaveBeenCalledWith('/path/to/file');
    expect(snackBarOpen).toHaveBeenCalledWith('导出成功', '确定', {duration: 3000});
  });

  it('should occure error', () => {
    const buildUrl = spyOn(component, 'buildUrl');
    buildUrl.and.returnValue('123');
    component.doResultsExport(1);
    exportAttendanceSheet$.error({
      error: {detail: ['Raw error message']},
    } as HttpErrorResponse);
    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
    expect(buildUrl).toHaveBeenCalled();
  });

});
