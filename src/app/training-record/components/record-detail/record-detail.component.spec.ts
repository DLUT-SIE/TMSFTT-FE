import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatCardModule,
         MatIconModule,
         MatPaginatorModule,
         MatFormFieldModule,
         MatSelectModule,
         MatSnackBar,
         MatInputModule,
         MatDividerModule,
         MatDialogModule,
         MatDialog,
         MatDialogRef,
        } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from '@angular/common';

import { RecordDetailComponent } from './record-detail.component';
import { Record } from 'src/app/shared/interfaces/record';
import { RecordService } from 'src/app/training-record/services/record.service';
import { FeedbackDialogComponent } from 'src/app/training-record/components/feedback-dialog/feedback-dialog.component';
import { OffCampusRecordDetailComponent } from 'src/app/shared/components/off-campus-record-detail/off-campus-record-detail.component';

describe('RecordDetailComponent', () => {
  let component: RecordDetailComponent;
  let fixture: ComponentFixture<RecordDetailComponent>;
  let feedBack$: Subject<{}>;
  let afterClosed$: Subject<string>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<FeedbackDialogComponent>>;
  let createFeedback: jasmine.Spy;
  let open: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;

  beforeEach(async(() => {
    feedBack$ = new Subject();
    afterClosed$ = new Subject();
    createFeedback = jasmine.createSpy();
    open = jasmine.createSpy();
    snackBarOpen = jasmine.createSpy();
    dialogRef = jasmine.createSpyObj('', ['afterClosed']);
    TestBed.configureTestingModule({
      declarations: [ RecordDetailComponent, OffCampusRecordDetailComponent ],
      imports: [
        MatCardModule,
        MatIconModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDividerModule,
        MatDialogModule,
        FormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
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
          },
        },
        {
          provide: RecordService,
          useValue: {
            createFeedback,
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open,
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
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
          },
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog', () => {
    open.and.returnValue(dialogRef);
    dialogRef.afterClosed.and.returnValue(afterClosed$);
    createFeedback.and.returnValue(feedBack$);

    component.openDialog();

    afterClosed$.next('123');
    feedBack$.next({});
    expect(open).toHaveBeenCalled();
    expect(createFeedback).toHaveBeenCalledWith(component.record.id, '123');
    expect(component.hasFeedbackSent).toBeTruthy();
  });
});
