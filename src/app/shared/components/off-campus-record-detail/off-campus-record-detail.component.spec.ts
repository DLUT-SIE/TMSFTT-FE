import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
  MatInputModule,
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { OffCampusRecordDetailComponent } from './off-campus-record-detail.component';
import { ReviewNoteService } from 'src/app/data-management/services/review-note.service';
import { ReviewNote } from 'src/app/shared/interfaces/review-note';
import { Record } from 'src/app/shared/interfaces/record';
import { Location } from '@angular/common';

describe('OffCampusRecordDetailComponent', () => {
  let component: OffCampusRecordDetailComponent;
  let fixture: ComponentFixture<OffCampusRecordDetailComponent>;
  let getReviewNotes$: jasmine.Spy;
  let createReviewNote$: Subject<ReviewNote>;
  let snackBarOpen: jasmine.Spy;

  beforeEach(async(() => {
    getReviewNotes$ = jasmine.createSpy();
    createReviewNote$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [ OffCampusRecordDetailComponent ],
      imports: [
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
              contents: [],
              attachments: [],
              user: 1,
              status: 1,
            } as Record}),
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffCampusRecordDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get reviewnotes', () => {
    const dummyRecord = {
      id: 1,
      create_time: '2019-01-01',
      update_time: '2019-01-02',
      campus_event: null,
      off_campus_event: null,
      contents: [],
      attachments: [],
      user: 1,
      status: 1,
    };
    component.record = dummyRecord;
    expect(component.getResults(10, 0)).toBe(getReviewNotes$);
  });

  it('should create reviewnote.', () => {
    const forceRefresh = spyOn(component, 'forceRefresh');

    component.onSubmit();
    createReviewNote$.next();

    expect(forceRefresh).toHaveBeenCalled();
  });

  it('should display errors when creation failed.', () => {
    createReviewNote$.error({
      message: 'Raw error message',
      error: {
        reviewnotecontent_data: ['Invalid content'],
      },
    } as HttpErrorResponse);

    component.onSubmit();

    expect(snackBarOpen).toHaveBeenCalledWith('Invalid content。', '创建失败！');
  });

  it('should display raw errors when creation failed.', () => {
    createReviewNote$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    component.onSubmit();

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '创建失败！');
  });

});
