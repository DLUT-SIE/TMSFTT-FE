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
  MatInputModule
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { DataReviewComponent } from './data-review.component';
import { ReviewNoteService } from '../../services/review-note.service';
import { ReviewNoteResponse } from 'src/app/shared/interfaces/review-note';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { RecordResponse } from 'src/app/shared/interfaces/record';

describe('DataReviewComponent', () => {
  let component: DataReviewComponent;
  let fixture: ComponentFixture<DataReviewComponent>;
  let getReviewNotes$: Subject<PaginatedResponse<ReviewNoteResponse>>;
  let createReviewNote$: Subject<ReviewNoteResponse>;
  let snackBarOpen: jasmine.Spy;
  const dummyReviewNote: ReviewNoteResponse = {
    id: 1,
    create_time: '2019-02-23T20:37:57.127073+08:00',
    field_name: 'time',
    content: '组织自己电子国内控制一次登录这样能够',
    record: 2,
    user: 48,
  };

  beforeEach(async(() => {
    getReviewNotes$ = new Subject<PaginatedResponse<ReviewNoteResponse>>();
    createReviewNote$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [ DataReviewComponent ],
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
          provide: Router,
          useValue: {}
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
    fixture = TestBed.createComponent(DataReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data', () => {
    const results: ReviewNoteResponse[] = [dummyReviewNote, dummyReviewNote];
    getReviewNotes$.next({
        count: 100,
        results,
        next: '',
        previous: ''
    });

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.results).toEqual(results);
    expect(component.resultsLength).toEqual(100);
  });

  it('should empty data if an error encountered.', () => {
    getReviewNotes$.error('a');

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.results).toEqual([]);
    expect(component.resultsLength).toEqual(0);
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

});
