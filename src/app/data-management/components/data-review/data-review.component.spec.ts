import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of as observableOf, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatPaginatorModule,
  MatIconModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSnackBar,
  MatInputModule
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { DataReviewComponent } from './data-review.component';
import { ReviewNoteService } from '../../services/review-note.service';
import { RecordService } from 'src/app/training-record/services/record.service';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { AdminGuard } from 'src/app/shared/guards/admin.guard';
import { ReviewNoteResponse } from 'src/app/shared/interfaces/review-note';
import { RecordStatus } from 'src/app/shared/enums/record-status.enum';
import { RecordResponse } from 'src/app/shared/interfaces/record';
import { Location } from '@angular/common';

describe('DataReviewComponent', () => {
  let component: DataReviewComponent;
  let fixture: ComponentFixture<DataReviewComponent>;
  let getReviewNotes$: jasmine.Spy;
  let updateRecordStatus$: Subject<RecordResponse>;
  let createReviewNote$: Subject<ReviewNoteResponse>;
  let snackBarOpen: jasmine.Spy;
  let authService: {
    isDepartmentAdmin: boolean,
    isSuperAdmin: boolean,
    isAuthenticated: boolean,
  };
  const dummyReviewNote: ReviewNoteResponse = {
    id: 1,
    create_time: '2019-02-23T20:37:57.127073+08:00',
    content: '组织自己电子国内控制一次登录这样能够',
    record: 2,
    user: 48,
  };
  const dummyRecord: RecordResponse = {
    id: 1,
    create_time: '2019-01-01',
    update_time: '2019-01-02',
    campus_event: null,
    off_campus_event: {id: 1,
                       create_time: '2019-03-02T09:07:57.159755+08:00',
                       update_time: '2019-03-02T09:07:57.159921+08:00',
                       name: 'sfdg',
                       time: '2019-03-02T00:00:00+08:00',
                       location: 'dfgfd',
                       num_hours: 0,
                       num_participants: 25
                      },
    contents: [],
    attachments: [],
    user: 1,
    status: 1,
  };

  beforeEach(async(() => {
    getReviewNotes$ = jasmine.createSpy();
    updateRecordStatus$ = new Subject();
    createReviewNote$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [ DataReviewComponent ],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatPaginatorModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [
        AdminGuard,
        {
          provide: AUTH_SERVICE,
          useValue: {
            isDepartmentAdmin: false,
            isSuperAdmin: false,
            isAuthenticated: true,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
            },
            data: observableOf({record: {
              id: 1,
              create_time: '2019-01-01',
              update_time: '2019-01-02',
              campus_event: null,
              off_campus_event: {id: 1,
                                 create_time: '2019-03-02T09:07:57.159755+08:00',
                                 update_time: '2019-03-02T09:07:57.159921+08:00',
                                 name: 'sfdg',
                                 time: '2019-03-02T00:00:00+08:00',
                                 location: 'dfgfd',
                                 num_hours: 0,
                                 num_participants: 25
                                 },
              contents: [],
              attachments: [],
              user: 1,
              status: 1,
            } as RecordResponse}),
          }
        },
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {
            createUrlTree: () => 'abc',
          },
        },
        {
          provide: ReviewNoteService,
          useValue: {
            getReviewNotes: () => getReviewNotes$,
            createReviewNote: () => createReviewNote$,
          }
        },
        {
          provide: RecordService,
          useValue: {
            updateRecordStatus: () => updateRecordStatus$,
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          },
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => { }),
        },
      ]
    })
    .compileComponents();
    authService = TestBed.get(AUTH_SERVICE);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get reviewnotes', () => {
    expect(component.getResults(10, 0)).toBe(getReviewNotes$);
  });

  it('should create reviewnote.', () => {
    const resultsLength = component.resultsLength;

    component.onSubmit();
    createReviewNote$.next(dummyReviewNote as ReviewNoteResponse);

    expect(component.resultsLength).toEqual(resultsLength + 1);
  });

  it('should display errors when creation failed.', () => {
    component.onSubmit();
    createReviewNote$.error({
      message: 'Raw error message',
      error: {
        reviewnotecontent_data: ['Invalid content'],
      },
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Invalid content。', '创建失败！');
  });

  it('should display raw errors when creation failed.', () => {
    component.onSubmit();
    createReviewNote$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '创建失败！');
  });

  it('should update record when record status changes', () => {
    authService.isDepartmentAdmin = true;
    authService.isSuperAdmin = false;
    const message = '通过';
    component.statuschange(message);
    updateRecordStatus$.next(dummyRecord as RecordResponse);
    expect(component.record).toBe(dummyRecord);
  });

  it('should change record status if user is DepartmentAdmin and press pass button', () => {
    authService.isDepartmentAdmin = true;
    authService.isSuperAdmin = false;
    const message = '通过';
    component.record = { id: 1,
                         create_time: '2019-01-01',
                         update_time: '2019-01-02',
                         campus_event: null,
                         off_campus_event: null,
                         contents: [],
                         attachments: [],
                         user: 1,
                         status: RecordStatus.STATUS_SUBMITTED,
                        };
    component.statuschange(message);
    expect(component.record.status).toBe(RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED);
    expect(snackBarOpen).toHaveBeenCalledWith('培训记录合格，已通过审核！', '关闭');
    component.record = { id: 1,
                         create_time: '2019-01-01',
                         update_time: '2019-01-02',
                         campus_event: null,
                         off_campus_event: null,
                         contents: [],
                         attachments: [],
                         user: 1,
                         status: RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED,
                        };
    component.statuschange(message);
    expect(snackBarOpen).toHaveBeenCalledWith('无权更改！', '关闭');
  });

    it('should change record status if user is DepartmentAdmin and press not pass button', () => {
    authService.isDepartmentAdmin = true;
    authService.isSuperAdmin = false;
    const message = '不通过';
    component.record = { id: 1,
                         create_time: '2019-01-01',
                         update_time: '2019-01-02',
                         campus_event: null,
                         off_campus_event: null,
                         contents: [],
                         attachments: [],
                         user: 1,
                         status: RecordStatus.STATUS_SUBMITTED,
                        };
    component.statuschange(message);
    expect(component.record.status).toBe(RecordStatus.STATUS_SUBMITTED);
    console.log(component.record.status);
    expect(snackBarOpen).toHaveBeenCalledWith('培训记录不合格，未通过审核！', '关闭');
    component.record = { id: 1,
                         create_time: '2019-01-01',
                         update_time: '2019-01-02',
                         campus_event: null,
                         off_campus_event: null,
                         contents: [],
                         attachments: [],
                         user: 1,
                         status: RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED,
                        };
    component.statuschange(message);
    expect(snackBarOpen).toHaveBeenCalledWith('无权更改！', '关闭');
  });

  it('should change record status if user is SuperAdmin and press pass button', () => {
    authService.isDepartmentAdmin = false;
    authService.isSuperAdmin = true;
    const message = '通过';
    component.record = { id: 1,
                         create_time: '2019-01-01',
                         update_time: '2019-01-02',
                         campus_event: null,
                         off_campus_event: null,
                         contents: [],
                         attachments: [],
                         user: 1,
                         status: RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED,
                        };
    component.statuschange(message);
    expect(component.record.status).toBe(RecordStatus.STATUS_SCHOOL_ADMIN_REVIEWED);
    expect(snackBarOpen).toHaveBeenCalledWith('培训记录合格，已通过审核！', '关闭');
    component.record = { id: 1,
                         create_time: '2019-01-01',
                         update_time: '2019-01-02',
                         campus_event: null,
                         off_campus_event: null,
                         contents: [],
                         attachments: [],
                         user: 1,
                         status: RecordStatus.STATUS_SUBMITTED,
                        };
    component.statuschange(message);
    expect(snackBarOpen).toHaveBeenCalledWith('无权更改！', '关闭');
  });

    it('should change record status if user is SuperAdmin and press not pass button', () => {
    authService.isDepartmentAdmin = false;
    authService.isSuperAdmin = true;
    const message = '不通过';
    component.record = { id: 1,
                         create_time: '2019-01-01',
                         update_time: '2019-01-02',
                         campus_event: null,
                         off_campus_event: null,
                         contents: [],
                         attachments: [],
                         user: 1,
                         status: RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED,
                        };
    component.statuschange(message);
    expect(component.record.status).toBe(RecordStatus.STATUS_SUBMITTED);
    expect(snackBarOpen).toHaveBeenCalledWith('培训记录不合格，未通过审核！', '关闭');
    component.record = { id: 1,
                         create_time: '2019-01-01',
                         update_time: '2019-01-02',
                         campus_event: null,
                         off_campus_event: null,
                         contents: [],
                         attachments: [],
                         user: 1,
                         status: RecordStatus.STATUS_SCHOOL_ADMIN_REVIEWED,
                        };
    component.statuschange(message);
    expect(snackBarOpen).toHaveBeenCalledWith('无权更改！', '关闭');
  });

});
