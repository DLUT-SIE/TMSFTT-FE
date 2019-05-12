import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {
  MatPaginatorModule,
  MatIconModule,
  MatFormFieldModule,
  MatSnackBar,
  MatInputModule,
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { OffCampusRecordDetailComponent } from './off-campus-record-detail.component';
import { ReviewNoteService } from 'src/app/shared/services/records/review-note.service';
import { ReviewNote } from 'src/app/shared/interfaces/review-note';
import { Location } from '@angular/common';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';


describe('OffCampusRecordDetailComponent', () => {
  let component: OffCampusRecordDetailComponent;
  let fixture: ComponentFixture<OffCampusRecordDetailComponent>;
  let getReviewNotes: jasmine.Spy;
  let getReviewNotes$: Subject<PaginatedResponse<ReviewNote>>;
  let createReviewNote$: Subject<ReviewNote>;
  let snackBarOpen: jasmine.Spy;
  const dummyReviewNote = { id: 1 };

  beforeEach(async(() => {
    getReviewNotes$ = new Subject();
    createReviewNote$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [ OffCampusRecordDetailComponent ],
      imports: [
        MatPaginatorModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
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
    getReviewNotes = spyOn(component, 'getReviewNotes');
    getReviewNotes.and.returnValue(getReviewNotes$);
    const record = {
      id: 1,
      create_time: '2019-01-01',
      update_time: '2019-01-02',
      campus_event: null,
      off_campus_event: {
        id: 1,
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
    component.record = record;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get reviewnotes', () => {
    expect(component.getReviewNotes(10, 0)).toBe(getReviewNotes$);
  });

  it('should create reviewnote.', () => {

    component.onSubmit();
    createReviewNote$.next();

  });

  it('should trigger refresh (at first page)', () => {
    const hasPreviousPage = spyOn(component.paginator, 'hasPreviousPage');
    const firstPage = spyOn(component.paginator, 'firstPage');
    hasPreviousPage.and.returnValue(true);
    component.forceRefresh();

    expect(hasPreviousPage).toHaveBeenCalled();
    expect(firstPage).toHaveBeenCalled();
  });

  it('should trigger refresh (not at first page)', () => {
    const hasPreviousPage = spyOn(component.paginator, 'hasPreviousPage');
    const firstPage = spyOn(component.paginator, 'firstPage');
    hasPreviousPage.and.returnValue(false);
    component.forceRefresh();

    expect(hasPreviousPage).toHaveBeenCalled();
    expect(firstPage).not.toHaveBeenCalled();
    expect(getReviewNotes).toHaveBeenCalled();
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

  it('should load data', () => {
    const results = [dummyReviewNote, dummyReviewNote, dummyReviewNote];
    getReviewNotes$.next({
      results,
      count: 100,
      previous: '',
      next: ''
    });

    expect(component.isLoadingReviewNotes).toBeFalsy();
    expect(component.reviewNotes).toEqual(results);
    expect(component.reviewNotesLength).toEqual(100);
  });

  it('should display errors when getting reviewnotes failed.', () => {
    getReviewNotes$.error({
      message: 'Raw error message',
      error: {
        reviewnotes_data: ['Rejected'],
      },
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Rejected。', '关闭');
  });

  it('should display raw errors when getting reviewnotes failed.', () => {
    getReviewNotes$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
  });

});
