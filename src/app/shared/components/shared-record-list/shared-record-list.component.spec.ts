import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule, MatChipsModule } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedRecordListComponent } from './shared-record-list.component';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { RecordListType } from '../../enums/record-list-type.enum';
import { TruncatePipe } from 'src/app/shared/pipes/truncate.pipe';

describe('SharedRecordListComponent', () => {
  let component: SharedRecordListComponent;
  let fixture: ComponentFixture<SharedRecordListComponent>;
  let getRecords: jasmine.Spy;

  beforeEach(async(() => {
    getRecords = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        SharedRecordListComponent,
        TruncatePipe,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatChipsModule,
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
            createUrlTree: () => 'abc',
          },
        },
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
    fixture = TestBed.createComponent(SharedRecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all records with detail.', () => {
    component.recordListType = RecordListType.ALL_RECORDS;
    const limit = 0;
    const offset = 10;

    component.getResults(offset, limit);

    expect(getRecords).toHaveBeenCalledWith('records/', {offset, limit});
  });

  it('should get reviewed records with detail.', () => {
    component.recordListType = RecordListType.REVIEWED_RECORDS;
    const limit = 0;
    const offset = 10;

    component.getResults(offset, limit);

    expect(getRecords).toHaveBeenCalledWith('records/reviewed/', {offset, limit});
  });

  it('should get off-campus-event records with detail.', () => {
    component.recordListType = RecordListType.OFF_CAMPUS_EVENT_RECORDS;
    const limit = 0;
    const offset = 10;
    const extraParams = new Map<string, string>();
    extraParams.set('off_campus_event__isnull', 'false');

    component.getResults(offset, limit);

    expect(getRecords).toHaveBeenCalledWith('records/list-records-for-review/', {offset, limit, extraParams});
  });

  it('should get all records if recordListType is undefined.', () => {
    const limit = 0;
    const offset = 10;

    component.getResults(offset, limit);

    expect(getRecords).toHaveBeenCalledWith('records/', {offset, limit});
  });
});
