import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
  MatDividerModule,
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { DataReviewComponent } from './data-review.component';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { Record } from 'src/app/shared/interfaces/record';
import { DetailItemComponent } from 'src/app/shared/components/detail-item/detail-item.component';
import { DetailItemContentComponent } from 'src/app/shared/components/detail-item-content/detail-item-content.component';
import { DetailItemTitleComponent } from 'src/app/shared/components/detail-item-title/detail-item-title.component';
import { DetailSectionActionsComponent } from 'src/app/shared/components/detail-section-actions/detail-section-actions.component';
import { DetailSectionComponent } from 'src/app/shared/components/detail-section/detail-section.component';
import { AppOffCampusRecordDetailStub } from 'src/testing/app-shared-off-campus-record-detail-stub.';

describe('DataReviewComponent', () => {
  let component: DataReviewComponent;
  let fixture: ComponentFixture<DataReviewComponent>;
  let updateRecordStatus$: Subject<void>;
  let closeRecord$: Subject<void>;
  let snackBarOpen: jasmine.Spy;

  beforeEach(async(() => {
    updateRecordStatus$ = new Subject();
    closeRecord$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        DataReviewComponent,
        AppOffCampusRecordDetailStub,
        DetailSectionComponent,
        DetailItemComponent,
        DetailItemTitleComponent,
        DetailItemContentComponent,
        DetailSectionActionsComponent,
      ],
      imports: [
        MatCardModule,
        MatPaginatorModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatSelectModule,
        FormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: {
            isDepartmentAdmin: true,
          },
        },
        {
          provide: Location,
          useValue: {
            back: () => {},
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
            } as Record}),
          }
        },
        {
          provide: Router,
          useValue: {
            createUrlTree: () => 'abc',
          },
        },
        {
          provide: RecordService,
          useValue: {
            updateRecordStatus: () => updateRecordStatus$,
            closeRecord: () => closeRecord$,
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

  it('should call snackbar when updation succeed.', () => {

    component.changeStatus(true);
    updateRecordStatus$.next();

    expect(snackBarOpen).toHaveBeenCalledWith('操作成功！', '关闭');
  });

  it('should display errors when updation failed.', () => {
    updateRecordStatus$.error({
      message: 'Raw error message',
      status: 400,
      error: {
        changestatus_data: ['Invalid content'],
      },
    } as HttpErrorResponse);

    component.changeStatus(true);

    expect(snackBarOpen).toHaveBeenCalledWith('changestatus_data: Invalid content', '关闭');
  });

  it('should display raw errors when updation failed.', () => {
    updateRecordStatus$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    component.changeStatus(true);

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
  });

  it('should call snackbar when close succeed.', () => {

    component.closeRecord();
    closeRecord$.next();

    expect(snackBarOpen).toHaveBeenCalledWith('操作成功！', '关闭');
  });

  it('should display errors when close failed.', () => {
    closeRecord$.error({
      message: 'Raw error message',
      status: 400,
      error: {
        closerecord_data: ['Invalid content'],
      },
    } as HttpErrorResponse);

    component.closeRecord();

    expect(snackBarOpen).toHaveBeenCalledWith('closerecord_data: Invalid content', '关闭');
  });

  it('should display raw errors when close failed.', () => {
    closeRecord$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    component.closeRecord();

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
  });

});
