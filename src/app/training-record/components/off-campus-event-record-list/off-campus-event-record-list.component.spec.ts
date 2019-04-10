import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { OffCampusEventRecordListComponent } from './off-campus-event-record-list.component';
import { RecordService } from '../../services/record.service';
import { RecordResponse } from 'src/app/shared/interfaces/record';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { Location } from '@angular/common';

describe('OffCampusEventRecordListComponent', () => {
  let component: OffCampusEventRecordListComponent;
  let fixture: ComponentFixture<OffCampusEventRecordListComponent>;
  let navigate: jasmine.Spy;
  let getRecords$: Subject<PaginatedResponse<RecordResponse>>;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getRecords$ = new Subject<PaginatedResponse<RecordResponse>>();
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
            }
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

  it('should navigate to form', () => {
    component.navigateToForm();

    expect(navigate).toHaveBeenCalled();
  });
});
