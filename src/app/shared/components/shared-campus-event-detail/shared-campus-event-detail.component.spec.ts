import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCampusEventDetailComponent } from './shared-campus-event-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { EventDetailType } from '../../enums/event-detail-type.enum';
import {
  MatIconModule,
  MatInputModule,
  MatSnackBar,
  MatDialog,
  MatDividerModule,
  MatProgressSpinnerModule,
  MatDialogModule,
} from '@angular/material';
import { EventService } from 'src/app/shared/services/events/event.service';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { Enrollment } from 'src/app/shared/interfaces/enrollment';
import { Record } from 'src/app/shared/interfaces/record';
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
  let enrollCampusEvent$: Subject<Enrollment>;
  let getEnrollments$: Subject<Enrollment[]>;
  let getRecordsByEvent$: Subject<Record[]>;
  let dialogOpen: jasmine.Spy;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    deleteEventEnrollment$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    dialogOpen = jasmine.createSpy();
    reviewCampusEvent = jasmine.createSpy();
    bypassSecurityTrustHtml = jasmine.createSpy().and.returnValue('abc');
    exportAttendanceSheet$ = new Subject<{'url': string}>();
    enrollCampusEvent$ = new Subject();
    windowOpen = jasmine.createSpy();
    getEnrollments$ = new Subject();
    getRecordsByEvent$ = new Subject();
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
        MatProgressSpinnerModule,
        MatDialogModule,
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
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [''],
            }
          },
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
            enrollCampusEvent: () => enrollCampusEvent$,
            getEnrollments: ({}) => getEnrollments$,
            reviewCampusEvent,
          }
        },
        {
          provide: RecordService,
          useValue: {
            getRecordsByEvent: ({}) => getRecordsByEvent$,
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open: dialogOpen,
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

  it('should navigate to add enroll user', () => {
    component.addEnrollmentUser();

    expect(navigate).toHaveBeenCalled();
  });

  it('should navigate to close specific record', () => {
    component.closeSpecifiedRecord();

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
    expect(component.event.enrolled).toBeFalsy();
    expect(component.event.enrollment_id).toBeNull();

    component.deleteEnrollment();
    deleteEventEnrollment$.error({
      status: 400,
      error: {detail: ['Raw error message']},
    } as HttpErrorResponse);
    expect(snackBarOpen).toHaveBeenCalledWith('失败原因： Raw error message', '关闭');

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
    component.event = {id: 1};
    component.doResultsExport();
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
    component.event = {id: 1};
    component.doResultsExport();
    exportAttendanceSheet$.error({
      status: 400,
      error: {detail: ['Raw error message']},
    } as HttpErrorResponse);
    expect(snackBarOpen).toHaveBeenCalledWith('失败原因： Raw error message', '关闭', {duration: 3000});
    expect(buildUrl).toHaveBeenCalled();
  });

  it('should enroll event', () => {
    component.enrollEvent();
    enrollCampusEvent$.next({id: 1});
    expect(snackBarOpen).toHaveBeenCalledWith('报名成功!', '关闭', {duration: 3000});
    expect(component.event.enrolled).toBeTruthy();
    expect(component.event.enrollment_id).toBe(1);

    component.enrollEvent();
    enrollCampusEvent$.error({
      status: 400,
      error: {detail: ['Raw error message']},
    } as HttpErrorResponse);
    expect(snackBarOpen).toHaveBeenCalledWith('失败原因： Raw error message', '关闭', {duration: 3000});
  });

  it('should copy enroll link', () => {
    component.copyEnrollLink();
    expect(snackBarOpen).toHaveBeenCalledWith('已将报名链接复制到剪贴板', '关闭', {duration: 3000});
  });

  it('should display enrollments', () => {
    component.displayEnrollments();
    getEnrollments$.next([]);
    expect(dialogOpen).toHaveBeenCalled();

    component.displayEnrollments();
    getEnrollments$.error({
      status: 400,
      error: {detail: ['Raw error message']},
    } as HttpErrorResponse);
    expect(snackBarOpen).toHaveBeenCalledWith('失败原因： Raw error message', '关闭', {duration: 3000});
  });

  it('should display records', () => {
    component.displayRecords();
    getRecordsByEvent$.next([]);
    expect(dialogOpen).toHaveBeenCalled();

    component.displayRecords();
    getRecordsByEvent$.error({
      status: 400,
      error: {detail: ['Raw error message']},
    } as HttpErrorResponse);
    expect(snackBarOpen).toHaveBeenCalledWith('失败原因： Raw error message', '关闭', {duration: 3000});
  });

});
