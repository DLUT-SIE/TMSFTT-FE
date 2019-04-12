import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { OffCampusEventRecordListComponent } from './off-campus-event-record-list.component';
import { RecordService } from '../../services/record.service';
import { RecordResponse } from 'src/app/shared/interfaces/record';
import { Location } from '@angular/common';

describe('OffCampusEventRecordListComponent', () => {
  let component: OffCampusEventRecordListComponent;
  let fixture: ComponentFixture<OffCampusEventRecordListComponent>;
  let navigate: jasmine.Spy;
  let getRecords$: jasmine.Spy;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getRecords$ = jasmine.createSpy();
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
            getRecords: () => getRecords$,
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
    expect(component.getResults(0, 0)).toBe(getRecords$);
  });

  it('should navigate to form', () => {
    component.navigateToForm();

    expect(navigate).toHaveBeenCalled();
  });

  it('should navigate to detail', () => {
    const record: RecordResponse = {
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
    };
    component.navigateToDetail(record);

    expect(navigate).toHaveBeenCalled();
  });
});
