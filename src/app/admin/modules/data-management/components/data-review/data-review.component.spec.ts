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
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { DataReviewComponent } from './data-review.component';
import { OffCampusRecordDetailComponent } from 'src/app/shared/components/off-campus-record-detail/off-campus-record-detail.component';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { Record } from 'src/app/shared/interfaces/record';

describe('DataReviewComponent', () => {
  let component: DataReviewComponent;
  let fixture: ComponentFixture<DataReviewComponent>;
  let updateRecordStatus$: Subject<void>;
  let snackBarOpen: jasmine.Spy;

  beforeEach(async(() => {
    updateRecordStatus$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [ DataReviewComponent, OffCampusRecordDetailComponent ],
      imports: [
        MatCardModule,
        MatPaginatorModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
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
            isSchoolAdmin: false,
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

    component.statuschange(true);
    updateRecordStatus$.next();

    expect(snackBarOpen).toHaveBeenCalledWith('状态已更改！', '关闭');
  });

  it('should display errors when updation failed.', () => {
    updateRecordStatus$.error({
      message: 'Raw error message',
      error: {
        statuschange_data: ['Invalid content'],
      },
    } as HttpErrorResponse);

    component.statuschange(true);

    expect(snackBarOpen).toHaveBeenCalledWith('更改失败！', '关闭');
  });

  it('should display raw errors when updation failed.', () => {
    updateRecordStatus$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    component.statuschange(true);

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
  });

});
