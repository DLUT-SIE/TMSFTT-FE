import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { OffCampusEventRecordListComponent } from './off-campus-event-record-list.component';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { Record } from 'src/app/shared/interfaces/record';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { Location } from '@angular/common';

describe('OffCampusEventRecordListComponent', () => {
  let component: OffCampusEventRecordListComponent;
  let fixture: ComponentFixture<OffCampusEventRecordListComponent>;
  let navigate: jasmine.Spy;
  let getRecordsWithDetail$: Subject<PaginatedResponse<Record>>;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getRecordsWithDetail$ = new Subject();
    TestBed.configureTestingModule({
      declarations: [
        OffCampusEventRecordListComponent,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
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
          },
        },
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {
            navigate,
          }
        },
        {
          provide: RecordService,
          useValue: {
            getRecordsWithDetail: () => getRecordsWithDetail$,
          }
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
    fixture = TestBed.createComponent(OffCampusEventRecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data', () => {
    expect(component.getResults(0, 0)).toBe(getRecordsWithDetail$);
  });

  it('should navigate to form', () => {
    component.navigateToForm();

    expect(navigate).toHaveBeenCalled();
  });

});
