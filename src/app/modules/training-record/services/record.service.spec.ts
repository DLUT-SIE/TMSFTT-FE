import { TestBed, tick, fakeAsync, discardPeriodicTasks } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { throwError, Subject } from 'rxjs';

import { RecordService } from './record.service';

import { environment } from 'src/environments/environment';
import { RecordRequest, RecordResponse, RecordAttachmentResponse } from 'src/app/interfaces/record';
import { ContentType } from 'src/app/enums/content-type.enum';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';
import { OffCampusEventResponse } from 'src/app/interfaces/event';

describe('RecordService', () => {
  let httpTestingController: HttpTestingController;
  const dummyOffCampusEvent: OffCampusEventResponse = {
    id: 1,
    create_time: "2019-02-21T16:40:03.799178+08:00",
    update_time: "2019-02-21T16:40:03.799197+08:00",
    name: "一起设计继续名称.",
    time: "2019-04-04T09:37:23.606866+08:00",
    location: "拉萨街j座",
    num_hours: 1.9768268898717425,
    num_participants: 60
  };
  const dummyRecordAttachment: RecordAttachmentResponse = {
    id: 1,
    create_time: "2019-02-21T16:40:11.057665+08:00",
    update_time: "2019-02-21T16:40:11.057681+08:00",
    attachment_type: 2,
    path: "/资料/必须/地址/都是.jpg",
    record: 1
  };
  const dummyRecordAttachments: RecordAttachmentResponse[] = [
    dummyRecordAttachment,
    dummyRecordAttachment
  ]
  const dummyRecord: RecordResponse = {
    id: 1,
    create_time: "2019-02-21T16:40:05.769180+08:00",
    update_time: "2019-02-21T16:40:14.231461+08:00",
    status: 3,
    campus_event: null,
    off_campus_event: dummyOffCampusEvent,
    attachments: dummyRecordAttachments,
    user: 127,
  };

  const dummyResponse: PaginatedResponse<RecordResponse> = {
    count: 100,
    next: 'next',
    previous: 'previous',
    results: [dummyRecord, dummyRecord],
  };
  const authenticationSucceed$ = new Subject<void>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: {
            authenticationSucceed: authenticationSucceed$,
            isAuthenticated: true,
          },
        },
      ]
    });
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: RecordService = TestBed.get(RecordService);
    expect(service).toBeTruthy();
  });

  it('should create off-campus record', () => {
    const service: RecordService = TestBed.get(RecordService);
    const createReq: RecordRequest = {
      off_campus_event: {
        name: 'name',
        location: 'loc',
        time: 'time',
        num_hours: 5,
        num_participants: 30,
      },
      user: 1,
      contents: [
        {
          content_type: ContentType.CONTENT_TYPE_CONTENT,
          content: 'abc',
        },
      ],
      attachments: [
        new File([''], 'file'),
        new File([''], 'file'),
      ]
    };

    service.createOffCampusRecord(createReq).subscribe();

    const req = httpTestingController.expectOne(
      `${environment.API_URL}/records/`);
    expect(req.request.method).toBe('POST');
    const form = req.request.body as FormData;
    expect(form.has('off_campus_event_data')).toBeTruthy();
    expect(form.has('user')).toBeTruthy();
    expect(form.has('attachments_data')).toBeTruthy();
    expect(form.has('contents_data')).toBeTruthy();
    req.flush({});
  });

  it('should delete record', () => {
    const service: RecordService = TestBed.get(RecordService);
    const id = 123;

    service.deleteRecord(id).subscribe();

    const req = httpTestingController.expectOne(
      `${environment.API_URL}/records/${id}/`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get records', () => {
    const service: RecordService = TestBed.get(RecordService);
    const offset = 0;
    const limit = 20;

    service.getRecords(offset, limit).subscribe(
      res => { expect(res.results.length).toEqual(2); });

    const url = `${environment.API_URL}/records/?offset=${offset}&limit=${limit}`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyResponse);
  });

  it('should ignore errors during getting records', fakeAsync(() => {
    const service: RecordService = TestBed.get(RecordService);
    authenticationSucceed$.next();
    const getRecords = spyOn(service, 'getRecords');

    getRecords.and.returnValue(throwError('error'));

    tick(1000);

    discardPeriodicTasks();
  }));

});
