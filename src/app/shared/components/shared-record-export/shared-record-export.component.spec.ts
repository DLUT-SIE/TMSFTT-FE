
import { SharedRecordExportComponent } from './shared-record-export.component';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatFormFieldModule,
  MatIconModule,
  MatDatepickerModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatNativeDateModule,
  MatInputModule,
  MatSnackBar,
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { Record } from 'src/app/shared/interfaces/record';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { WindowService } from 'src/app/shared/services/window.service';
import { TruncatePipe } from 'src/app/shared/pipes/truncate.pipe';
import { RecordExportType } from '../../enums/record-export-type.enum';

describe('SharedRecordExportComponent', () => {
  let component: SharedRecordExportComponent;
  let fixture: ComponentFixture<SharedRecordExportComponent>;
  let getRecords: jasmine.Spy;
  let exportRecordsSubject$ = new Subject<{'url': string}>();
  let getRecords$: Subject<PaginatedResponse<Record>>;
  let snackBarOpen: jasmine.Spy;
  let windowOpen: jasmine.Spy;
  let replaceState: jasmine.Spy;
  let go: jasmine.Spy;

  beforeEach(async(() => {
    getRecords$ = new Subject();
    getRecords = jasmine.createSpy().and.returnValue(getRecords$);
    snackBarOpen = jasmine.createSpy();
    windowOpen = jasmine.createSpy();
    replaceState = jasmine.createSpy();
    go = jasmine.createSpy();
    exportRecordsSubject$ = new Subject<{'url': string}>();
    TestBed.configureTestingModule({
      declarations: [
        SharedRecordExportComponent,
        TruncatePipe,
      ],
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
          useValue: {
            createUrlTree: () => 'abc',
          },
        },
        {
          provide: RecordService,
          useValue: {
            getRecords,
            exportRecords: () => exportRecordsSubject$,
          },
        },
        {
          provide: Location,
          useValue: {
            go, replaceState,
          },
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => { }),
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          }
        },
        {
          provide: WindowService,
          useValue: {
            open: windowOpen,
          }
        }
      ],
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(SharedRecordExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get Results', () => {
    const userName = '124';
    const eventName = 'abc';
    const location = 'loc';
    const startTime = 'abc';
    const endTime = 'abc';
    const offset = 5;
    const limit = 10;
    component.filterForm.setValue({
      userName, eventName, location, startTime, endTime,
    });
    const params = new Map<string, string>([
      ['user__username', userName],
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
    const userName = 'abc';
    const eventName = 'abc';
    const location = 'loc';
    const startTime = '';
    const endTime = '';
    const offset = 5;
    const limit = 10;
    component.filterForm.setValue({
      userName, eventName, location, startTime, endTime,
    });
    const params = new Map<string, string>([
      ['user__username', userName],
      ['event_name', eventName],
      ['event_location', location],
      ['start_time', startTime],
      ['end_time', endTime],
    ]);

    component.getResults(offset, limit);

    expect(getRecords).toHaveBeenCalledWith('records', {offset, limit, extraParams: params});
  });


  it('should occure error', () => {
    const buildUrl = spyOn(component, 'buildUrl');
    buildUrl.and.returnValue('123');
    component.doResultsExport();
    exportRecordsSubject$.error({
      status: 400,
      error: {detail: ['Raw error message']},
    } as HttpErrorResponse);
    expect(snackBarOpen).toHaveBeenCalledWith('失败原因： Raw error message', '关闭');
    expect(buildUrl).toHaveBeenCalled();
  });

  it('should load data', () => {
    const buildUrl = spyOn(component, 'buildUrl');
    buildUrl.and.returnValue('123');
    component.doResultsExport();
    exportRecordsSubject$.next({
      url: '/path/to/file',
    } as {url: string});
    expect(buildUrl).toHaveBeenCalled();
    expect(windowOpen).toHaveBeenCalledWith('/path/to/file');
    expect(snackBarOpen).toHaveBeenCalledWith('导出成功', '确定', {duration: 3000});
  });

  it('should build url', () => {
    component.recordExportType = RecordExportType.EXPORT_FOR_ADMIN;
    component.valueToExport = {
      userName: '111',
      eventName: '111',
      location: '222',
      startTime: new Date(2019, 5, 21),
      endTime: new Date(2019, 5, 21),
    };

    spyOn(component.datePipe, 'transform').and.returnValue('abc');
    const url: string = component.buildUrl();

    expect(url).toEqual(
      `/aggregate-data/table-export/?table_type=8&user__username=111&event_name=111&event_location=222&start_time=abc&end_time=abc`);
  });
});
