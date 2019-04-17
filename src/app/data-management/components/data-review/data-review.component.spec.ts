import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
import { RecordResponse } from 'src/app/shared/interfaces/record';

describe('DataReviewComponent', () => {
  let component: DataReviewComponent;
  let fixture: ComponentFixture<DataReviewComponent>;
  let snackBarOpen: jasmine.Spy;

  beforeEach(async(() => {
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
          useValue: {
            createUrlTree: () => 'abc',
          },
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

});
