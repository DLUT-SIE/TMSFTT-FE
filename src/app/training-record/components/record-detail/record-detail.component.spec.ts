import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, Subject } from 'rxjs';
import { MatCardModule,
         MatIconModule,
         MatDividerModule,
         MatDialogModule,
         MatDialog,
         MatDialogRef,
        } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RecordDetailComponent } from './record-detail.component';
import { RecordResponse } from 'src/app/shared/interfaces/record';
import { RecordService } from 'src/app/training-record/services/record.service';
import { FeedbackDialogComponent } from 'src/app/training-record/components/feedback-dialog/feedback-dialog.component';

describe('RecordDetailComponent', () => {
  let component: RecordDetailComponent;
  let fixture: ComponentFixture<RecordDetailComponent>;
  let feedBack$: Subject<{}>;
  let afterClosed$: Subject<string>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<FeedbackDialogComponent>>;
  let createFeedback: jasmine.Spy;
  let open: jasmine.Spy;

  beforeEach(async(() => {
    feedBack$ = new Subject();
    afterClosed$ = new Subject();
    createFeedback = jasmine.createSpy();
    open = jasmine.createSpy();
    dialogRef = jasmine.createSpyObj('', ['afterClosed']);
    TestBed.configureTestingModule({
      declarations: [ RecordDetailComponent ],
      imports: [
        MatCardModule,
        MatIconModule,
        MatDividerModule,
        MatDialogModule,
        HttpClientTestingModule
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
    expect(component.isFeedBacked).toBeTruthy();
  });
});
