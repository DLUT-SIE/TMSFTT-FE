import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject, throwError, of as observableOf } from 'rxjs';

import { RecordService } from './record.service';
import { RecordContentService } from './record-content.service';
import { RecordAttachmentService } from './record-attachment.service';
import { EventService } from '../events/event.service';

import { environment } from 'src/environments/environment';
import { Record } from 'src/app/shared/interfaces/record';
import { ContentType } from 'src/app/shared/enums/content-type.enum';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { RecordAttachment } from '../../interfaces/record-attachment';
import { RecordContent } from '../../interfaces/record-content';
import { CampusEvent, OffCampusEvent } from '../../interfaces/event';
import { RoleChoice } from '../../interfaces/event-role-choices';

describe('RecordService', () => {
  let httpTestingController: HttpTestingController;
  let authenticationSucceed$: Subject<void>;
  let getRecordAttachments$: Subject<RecordAttachment[]>;
  let getRecordContents$: Subject<RecordContent[]>;
  let getEvent$: Subject<CampusEvent>;
  let getOffCampusEvent$: Subject<OffCampusEvent>;
  let getRecord$: Subject<Record>;

  beforeEach(() => {
    authenticationSucceed$ = new Subject<void>();
    getRecordAttachments$ = new Subject();
    getRecordContents$ = new Subject();
    getEvent$ = new Subject();
    getOffCampusEvent$ = new Subject();
    getRecord$ = new Subject();
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
            isDepartmentAdmin: true,
          },
        },
        {
          provide: RecordAttachmentService,
          useValue: {
            getRecordAttachments: () => getRecordAttachments$,
          },
        },
        {
          provide: RecordContentService,
          useValue: {
            getRecordContents: () => getRecordContents$,
          },
        },
        {
          provide: EventService,
          useValue: {
            getEvent: () => getEvent$,
            getOffCampusEvent: () => getOffCampusEvent$,
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
    const createReq: Record = {
      off_campus_event: {},
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
      ],
      role: 0,
    };

    service.createOffCampusRecord(createReq).subscribe();

    const req = httpTestingController.expectOne(
      `/records/`);
    expect(req.request.method).toBe('POST');
    const form = req.request.body as FormData;
    expect(form.has('off_campus_event')).toBeTruthy();
    expect(form.has('user')).toBeTruthy();
    expect(form.has('attachments')).toBeTruthy();
    expect(form.has('contents')).toBeTruthy();
    req.flush({});
  });

  it('should delete record', () => {
    const service: RecordService = TestBed.get(RecordService);
    const id = 123;

    service.deleteRecord(id).subscribe();

    const req = httpTestingController.expectOne(
      `/records/${id}/`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should update off-campus-record.', () => {
    const service: RecordService = TestBed.get(RecordService);
    const updateReq: Record = {
      id: 1,
      off_campus_event: {},
      user: 1,
      contents: [],
      attachments: [],
      role: 0,
    };

    service.updateOffCampusRecord(updateReq).subscribe();
    const req = httpTestingController.expectOne(
      `/records/1/`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should get records', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.getRecords('records', {}).subscribe();

    const url = `/records/?limit=10&offset=0`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({ count: 2 });
  });

  it('should get records by event', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.getRecordsByEvent(2).subscribe();

    const url = `/records/list-records-by-event/?campus_event=2&limit=-1&offset=0`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should get record', () => {
    const service: RecordService = TestBed.get(RecordService);
    const id = 1;

    service.getRecord(id).subscribe();

    const url = `/records/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('shoule get off-campus-event record with detail data', () => {
    const service: RecordService = TestBed.get(RecordService);
    const id = 1;
    const offCampusEventRecord: Record = {
      id: 1,
      off_campus_event: {},
      user: 1,
      contents: [],
      attachments: [],
      role: 0,
    };
    const getRecord = spyOn(service, 'getRecord');
    getRecord.and.returnValue(getRecord$);
    service.getRecordWithDetail(id).subscribe(
      (data: Record) => {
        expect(data.attachments).toEqual([]);
        expect(data.contents).toEqual([]);
    });
    getRecord$.next(offCampusEventRecord);
    getRecordAttachments$.next([]);
    getRecordContents$.next([]);
  });

  it('shoule get campus-event record with detail data', () => {
    const service: RecordService = TestBed.get(RecordService);
    const id = 1;
    const campusEventRecord: Record = {
      id: 1,
      campus_event: {},
      user: 1,
      contents: [],
      attachments: [],
      role: 0,
    };
    const getRecord = spyOn(service, 'getRecord');
    getRecord.and.returnValue(getRecord$);
    service.getRecordWithDetail(id).subscribe(
      (data: Record) => {
        expect(data.attachments).toEqual([]);
        expect(data.contents).toEqual([]);
    });
    getRecord$.next(campusEventRecord);
    getRecordAttachments$.next([]);
    getRecordContents$.next([]);
  });

  it('should get number of records without feedback', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.getNumberOfRecordsWithoutFeedback().subscribe();

    const url = `/records/no-feedback-records-count/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should return count of records without feedback,', fakeAsync(() => {
    const service: RecordService = TestBed.get(RecordService);
    authenticationSucceed$.next();
    const spy = spyOn(service, 'getNumberOfRecordsWithoutFeedback');
    spy.and.returnValue(observableOf({count: 10}));

    tick(environment.REFRESH_INTERVAL);

    expect(service.numberOfRecordsWithoutFeedback).toBe(10);

    discardPeriodicTasks();
  }));

  it('should return 0 if getNumberOfRecordsWithoutFeedback() fail', fakeAsync(() => {
    const service: RecordService = TestBed.get(RecordService);
    authenticationSucceed$.next();
    const spy = spyOn(service, 'getNumberOfRecordsWithoutFeedback');

    spy.and.returnValue(throwError(''));

    tick(environment.REFRESH_INTERVAL);

    expect(service.numberOfRecordsWithoutFeedback).toBe(0);
  }));

  it('should batch-submit record', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.batchSubmitRecord(new File([], 'a.xlsx')).subscribe();

    const url = `/records/batch-submit/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should feed back', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.createFeedback(1, '').subscribe();

    const url = `/campus-event-feedbacks/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should update record status if admin approved', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.updateRecordStatus(1, true, false).subscribe();

    const url1 = `/records/1/department-admin-review/`;

    const req1 = httpTestingController.expectOne(url1);
    expect(req1.request.method).toEqual('POST');
    req1.flush({});

    service.updateRecordStatus(1, true, true).subscribe();

    const url2 = `/records/1/school-admin-review/`;

    const req2 = httpTestingController.expectOne(url2);
    expect(req2.request.method).toEqual('POST');
    req2.flush({});
  });

  it('should close record if school admin approved', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.closeRecord(1).subscribe();

    const url = `/records/1/close/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should get role-choices.', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.getRoleChoices().subscribe((data: RoleChoice[]) => {
      expect(data.length).toEqual(2);
    });
    const url = `/role-choices/`;

    const req = httpTestingController.expectOne(url);

    expect(req.request.method).toEqual('GET');
    req.flush([{val: 1, name: '123'}, {val: 0, name: 'test2'}]);

    service.getRoleChoices().subscribe((data: RoleChoice[]) => {
      expect(data.length).toEqual(2);
    });
  });

  it('should export Records.', () => {
    const service: RecordService = TestBed.get(RecordService);

    const url = `1433223`;
    service.exportRecords(url).subscribe();

    const req = httpTestingController.expectOne(url);

    expect(req.request.method).toEqual('GET');
  });
});
