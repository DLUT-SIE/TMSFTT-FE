import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { Subject } from 'rxjs';

import { ListViewComponent } from './list-view.component';
import { RecordService } from '../../services/record.service';
import { RecordResponse } from 'src/app/interfaces/record';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';

describe('ListViewComponent', () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;
  let getRecords$: Subject<PaginatedResponse<RecordResponse>>;
  let getRecords: jasmine.Spy;
  const dummyRecord: RecordResponse = {
    id: 1,
    create_time: "2019-02-21T16:40:05.769180+08:00",
    update_time: "2019-02-21T16:40:14.231461+08:00",
    status: 3,
    campus_event: null,
    off_campus_event: 1,
    user: 127,
  };

  beforeEach(async(() => {
    getRecords$ = new Subject<PaginatedResponse<RecordResponse>>();
    getRecords = jasmine.createSpy();
    getRecords.and.returnValue(getRecords$);
    TestBed.configureTestingModule({
      declarations: [ ListViewComponent ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
      ],
      providers: [
        {
          provide: RecordService,
          useValue: {
            getRecords,
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
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data', () => {
    const count = 100;
    const results: RecordResponse[] = [dummyRecord, dummyRecord];
    getRecords$.next({ count, results, next: '', previous: '' });

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.records).toEqual(results);
    expect(component.recordsLength).toEqual(count);
  });

  it('should empty data if an error encountered.', () => {
    getRecords$.error('error');

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.records).toEqual([]);
    expect(component.recordsLength).toEqual(0);
  });
});
