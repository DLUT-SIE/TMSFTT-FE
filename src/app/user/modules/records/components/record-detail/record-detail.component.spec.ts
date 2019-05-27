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
import { RecordService } from 'src/app/shared/services/records/record.service';
import { FeedbackDialogComponent } from 'src/app/user/modules/records/components/feedback-dialog/feedback-dialog.component';
import { DetailItemComponent } from 'src/app/shared/components/detail-item/detail-item.component';
import { DetailItemContentComponent } from 'src/app/shared/components/detail-item-content/detail-item-content.component';
import { DetailItemTitleComponent } from 'src/app/shared/components/detail-item-title/detail-item-title.component';
import { DetailSectionActionsComponent } from 'src/app/shared/components/detail-section-actions/detail-section-actions.component';
import { DetailSectionComponent } from 'src/app/shared/components/detail-section/detail-section.component';
import { AppOffCampusRecordDetailStub } from 'src/testing/app-shared-off-campus-record-detail-stub.';

describe('RecordDetailComponent', () => {
  let component: RecordDetailComponent;
  let fixture: ComponentFixture<RecordDetailComponent>;
  let feedBack$: Subject<{}>;
  let afterClosed$: Subject<string>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<FeedbackDialogComponent>>;
  let createFeedback: jasmine.Spy;
  let open: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;
  let navigate: jasmine.Spy;

  beforeEach(async(() => {
    feedBack$ = new Subject();
    afterClosed$ = new Subject();
    navigate = jasmine.createSpy();
    createFeedback = jasmine.createSpy();
    open = jasmine.createSpy();
    snackBarOpen = jasmine.createSpy();
    dialogRef = jasmine.createSpyObj('', ['afterClosed']);
    TestBed.configureTestingModule({
      declarations: [
        RecordDetailComponent,
        AppOffCampusRecordDetailStub,
        DetailSectionComponent,
        DetailItemComponent,
        DetailItemTitleComponent,
        DetailItemContentComponent,
        DetailSectionActionsComponent,
      ],
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
              status: 2,
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
            navigate,
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

  it('should do nothing if no input', () => {
    open.and.returnValue(dialogRef);
    dialogRef.afterClosed.and.returnValue(afterClosed$);

    component.openDialog();

    afterClosed$.next();
    expect(open).toHaveBeenCalled();
    expect(component.hasFeedbackSent).toBeFalsy();
  });

  it('should navigate to form', () => {
    component.navigateToForm();

    expect(navigate).toHaveBeenCalled();
  });
});
