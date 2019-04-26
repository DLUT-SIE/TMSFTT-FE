import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
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
import { ReviewNoteService } from 'src/app/shared/services/records/review-note.service';
import { ReviewNote } from 'src/app/shared/interfaces/review-note';
import { Location } from '@angular/common';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';


describe('OffCampusRecordDetailComponent', () => {
  let component: OffCampusRecordDetailComponent;
  let fixture: ComponentFixture<OffCampusRecordDetailComponent>;
  let getReviewNotes$: Subject<PaginatedResponse<ReviewNote>>;
  let createReviewNote$: Subject<ReviewNote>;
  let snackBarOpen: jasmine.Spy;

  beforeEach(async(() => {
    getReviewNotes$ = new Subject();
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
