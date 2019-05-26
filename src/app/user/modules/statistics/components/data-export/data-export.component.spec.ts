import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatFormFieldModule,
  MatIconModule,
  MatDatepickerModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatNativeDateModule,
  MatInputModule,
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DataExportComponent } from './data-export.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { Record } from 'src/app/shared/interfaces/record';
import { Subject } from 'rxjs';

describe('DataExportComponent', () => {
  let component: DataExportComponent;
  let fixture: ComponentFixture<DataExportComponent>;
  let getRecords: jasmine.Spy;
  let getRecords$: Subject<PaginatedResponse<Record>>;

  beforeEach(async(() => {
    getRecords$ = new Subject();
    getRecords = jasmine.createSpy().and.returnValue(getRecords$);
    TestBed.configureTestingModule({
      declarations: [DataExportComponent],
      imports: [
        NoopAnimationsModule,
        MatFormFieldModule,
        MatIconModule,
        MatDatepickerModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatNativeDateModule,
        ReactiveFormsModule,
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
            }
          },
        },
        {
          provide: Router,
          useValue: {},
        },
        {
          provide: RecordService,
          useValue: {
            getRecords,
          },
        },
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => { }),
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get Results', () => {
    const eventName = 'abc';
    const location = 'loc';
    const startTime = 'abc';
    const endTime = 'abc';
    const offset = 5;
    const limit = 10;
    component.filterForm.setValue({
      eventName, location, startTime, endTime,
    });
    const params = new Map<string, string>([
      ['event_name', eventName],
      ['event_location', location],
      ['start_time', startTime],
      ['end_time', endTime],
    ]);

    spyOn(component.datePipe, 'transform').and.returnValue('abc');
    component.getResults(offset, limit);

    expect(getRecords).toHaveBeenCalledWith('records', {offset, limit, extraParams: params});
  });

  it('should get Results without time', () => {
    const eventName = 'abc';
    const location = 'loc';
    const startTime = '';
    const endTime = '';
    const offset = 5;
    const limit = 10;
    component.filterForm.setValue({
      eventName, location, startTime, endTime,
    });
    const params = new Map<string, string>([
      ['event_name', eventName],
      ['event_location', location],
      ['start_time', startTime],
      ['end_time', endTime],
    ]);

    component.getResults(offset, limit);

    expect(getRecords).toHaveBeenCalledWith('records', {offset, limit, extraParams: params});
  });
});
