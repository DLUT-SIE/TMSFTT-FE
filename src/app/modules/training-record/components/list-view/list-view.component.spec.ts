import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { Subject } from 'rxjs';

import { ListViewComponent } from './list-view.component';
import { RecordService } from '../../services/record.service';
import { RecordResponse, RecordAttachmentResponse, RecordContentResponse } from 'src/app/interfaces/record';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';
import { OffCampusEventResponse } from 'src/app/interfaces/event';

describe('ListViewComponent', () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;
  let getRecords$: Subject<PaginatedResponse<RecordResponse>>;
  let getRecords: jasmine.Spy;
  const dummyOffCampusEvent: OffCampusEventResponse = {
    id: 1,
    create_time: '2019-02-21T16:40:03.799178+08:00',
    update_time: '2019-02-21T16:40:03.799197+08:00',
    name: '一起设计继续名称.',
    time: '2019-04-04T09:37:23.606866+08:00',
    location: '拉萨街j座',
    num_hours: 1.9768268898717425,
    num_participants: 60
  };
  const dummyRecordAttachment: RecordAttachmentResponse = {
    id: 1,
    create_time: '2019-02-21T16:40:11.057665+08:00',
    update_time: '2019-02-21T16:40:11.057681+08:00',
    attachment_type: 2,
    path: '/资料/必须/地址/都是.jpg',
    record: 1
  };
  const dummyRecordAttachments: RecordAttachmentResponse[] = [
    dummyRecordAttachment,
    dummyRecordAttachment,
  ];
  const dummyRecordContent: RecordContentResponse = {
    id: 2,
    create_time: '2019-02-21T16:40:07.759937+08:00',
    update_time: '2019-02-21T16:40:07.759954+08:00',
    content_type: 0,
    content: '游戏积分部门精华.\n东西为什然后.留言企业选择主要大学如何.完全可能没有同时留言这个经营.\n然后影响电子成为.会员商品推荐.然后数据信息不断.全国通过来自一切分析.\n网上地址这些详细认为信息自己.',
    record: 3
  };
  const dummyRecordContents: RecordContentResponse[] = [
    dummyRecordContent,
    dummyRecordContent,
  ];
  const dummyRecord: RecordResponse = {
    id: 1,
    create_time: '2019-02-21T16:40:05.769180+08:00',
    update_time: '2019-02-21T16:40:14.231461+08:00',
    status: 3,
    campus_event: null,
    off_campus_event: dummyOffCampusEvent,
    attachments: dummyRecordAttachments,
    contents: dummyRecordContents,
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
