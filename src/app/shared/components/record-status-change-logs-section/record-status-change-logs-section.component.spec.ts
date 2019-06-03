import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordStatusChangeLogsSectionComponent } from './record-status-change-logs-section.component';
import { DetailItemComponent } from '../detail-item/detail-item.component';
import { DetailItemTitleComponent } from '../detail-item-title/detail-item-title.component';
import { DetailItemContentComponent } from '../detail-item-content/detail-item-content.component';
import { MatPaginatorModule, MatSnackBar } from '@angular/material';
import { RecordService } from '../../services/records/record.service';
import { PaginatedResponse } from '../../interfaces/paginated-response';
import { StatusChangeLog } from '../../interfaces/status-change-log';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('RecordStatusChangeLogsSectionComponent', () => {
  let component: RecordStatusChangeLogsSectionComponent;
  let fixture: ComponentFixture<RecordStatusChangeLogsSectionComponent>;
  let open: jasmine.Spy;
  let getStatusChangeLogs$: Subject<PaginatedResponse<StatusChangeLog>>;

  beforeEach(async(() => {
    getStatusChangeLogs$ = new Subject();
    open = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        RecordStatusChangeLogsSectionComponent,
        DetailItemComponent,
        DetailItemTitleComponent,
        DetailItemContentComponent,
      ],
      imports: [
        MatPaginatorModule,
      ],
      providers: [
        {
          provide: RecordService,
          useValue: {
            getStatusChangeLogs: () => getStatusChangeLogs$,
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open
          }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordStatusChangeLogsSectionComponent);
    component = fixture.componentInstance;
    const record = {
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
      role: 1,
      role_str: '1433223',
    };
    component.record = record;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get status change logs', () => {
    expect(component.getStatusChangeLogs(10, 0)).toBe(getStatusChangeLogs$);
  });

  it('should trigger refresh (at first page)', () => {
    const hasPreviousPage = spyOn(component.paginator, 'hasPreviousPage');
    const firstPage = spyOn(component.paginator, 'firstPage');
    hasPreviousPage.and.returnValue(true);
    component.forceRefresh();

    expect(hasPreviousPage).toHaveBeenCalled();
    expect(firstPage).toHaveBeenCalled();
  });

  it('should trigger refresh (not at first page)', () => {
    const hasPreviousPage = spyOn(component.paginator, 'hasPreviousPage');
    const firstPage = spyOn(component.paginator, 'firstPage');
    hasPreviousPage.and.returnValue(false);
    component.forceRefresh();

    expect(hasPreviousPage).toHaveBeenCalled();
    expect(firstPage).not.toHaveBeenCalled();
  });

  it('should load data', () => {
    const dummyLog: StatusChangeLog = {};
    const results = [dummyLog, dummyLog];
    getStatusChangeLogs$.next({
      results,
      count: 100,
      previous: '',
      next: ''
    });

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.statusChangeLogs).toEqual(results);
    expect(component.totalLength).toEqual(100);
  });

  it('should display errors when getting status change logs failed.', () => {
    getStatusChangeLogs$.error({
      message: 'Raw error message',
      error: {
        err: ['Rejected'],
      },
    } as HttpErrorResponse);

    expect(open).toHaveBeenCalledWith('请求失败。', '关闭');
  });

  it('should display raw errors when getting status change logs failed.', () => {
    getStatusChangeLogs$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    expect(open).toHaveBeenCalledWith('Raw error message', '关闭');
  });
});
