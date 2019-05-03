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
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';

describe('RecordService', () => {
  let httpTestingController: HttpTestingController;
  let authenticationSucceed$: Subject<void>;
  let getRecordAttachments$: Subject<PaginatedResponse<RecordAttachment>>;
  let getRecordContents$: Subject<PaginatedResponse<RecordContent>>;
  let getEvent$: Subject<CampusEvent>;
  let getOffCampusEvent$: Subject<OffCampusEvent>;
  let getRecords$: Subject<PaginatedResponse<Record>>;
  let getRecord$: Subject<Record>;
  let getReviewedRecords$: Subject<PaginatedResponse<Record>>;

  beforeEach(() => {
    authenticationSucceed$ = new Subject<void>();
    getRecordAttachments$ = new Subject();
    getRecordContents$ = new Subject();
    getEvent$ = new Subject();
    getOffCampusEvent$ = new Subject();
    getRecords$ = new Subject();
    getRecord$ = new Subject();
    getReviewedRecords$ = new Subject();
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
            isSchoolAdmin: false,
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
      off_campus_event: 3,
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
      off_campus_event: 3,
      user: 1,
      contents: [],
      attachments: []
    };

    service.updateOffCampusRecord(updateReq).subscribe();
    const req = httpTestingController.expectOne(
      `/records/1/`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should get records', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.getRecords({}).subscribe();

    const url = `/records/?limit=10&offset=0`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({ count: 2 });
  });

  it('should get off-campus-event records with detail data.', () => {
    const service: RecordService = TestBed.get(RecordService);
    const offCampusEventRecord: Record = {
      off_campus_event: 3,
      user: 1,
      contents: [],
      attachments: [],
    };
    const offCampusEventRecords: PaginatedResponse<Record> = {
      count: 2,
      next: '',
      previous: '',
      results: [offCampusEventRecord, offCampusEventRecord]
    };
    const getRecords = spyOn(service, 'getRecords');
    getRecords.and.returnValue(getRecords$);

    service.getRecordsWithDetail({}).subscribe(data => {
      expect(data.results.length).toBe(2);
      expect(data.results[0].off_campus_event).toEqual({});
      expect(data.results[1].off_campus_event).toEqual({});
    }
    );
    getRecords$.next(offCampusEventRecords);
    getOffCampusEvent$.next({});
    getOffCampusEvent$.next({});
  });

  it('should get campus-event records with detail data.', () => {
    const service: RecordService = TestBed.get(RecordService);
    const campusEventRecord: Record = {
      campus_event: 3,
      user: 1,
      contents: [],
      attachments: [],
    };
    const campusEventRecords: PaginatedResponse<Record> = {
      count: 2,
      next: '',
      previous: '',
      results: [campusEventRecord, campusEventRecord]
    };
    const getRecords = spyOn(service, 'getRecords');
    getRecords.and.returnValue(getRecords$);

    service.getRecordsWithDetail({}).subscribe(data => {
      expect(data.results.length).toBe(2);
      expect(data.results[0].campus_event).toEqual({});
      expect(data.results[1].campus_event).toEqual({});
    }
    );
    getRecords$.next(campusEventRecords);
    getEvent$.next({});
    getEvent$.next({});
  });

  it('should get reviewed records', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.getReviewedRecords({}).subscribe();

    const url = `/records/reviewed/?limit=10&offset=0`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({ count: 2 });
  });

  it('should get reviewed records with detail data', () => {
    const service: RecordService = TestBed.get(RecordService);
    const getReviewedRecords = spyOn(service, 'getReviewedRecords');
    getReviewedRecords.and.returnValue(getReviewedRecords$);

    service.getReviewedRecordsWithDetail({}).subscribe();

    expect(getReviewedRecords).toHaveBeenCalled();
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
      off_campus_event: 3,
      user: 1,
      contents: {count: 0, next: '', previous: '', results: []},
      attachments: {count: 0, next: '', previous: '', results: []},
    };
    const getRecord = spyOn(service, 'getRecord');
    getRecord.and.returnValue(getRecord$);
    service.getRecordWithDetail(id).subscribe(
      (data: Record) => {
        expect(data.off_campus_event).toEqual({});
        expect(data.attachments).toEqual([]);
        expect(data.contents).toEqual([]);
    });
    getRecord$.next(offCampusEventRecord);
    getOffCampusEvent$.next({});
    getRecordAttachments$.next({count: 0, next: '', previous: '', results: []});
    getRecordContents$.next({count: 0, next: '', previous: '', results: []});
  });

  it('shoule get campus-event record with detail data', () => {
    const service: RecordService = TestBed.get(RecordService);
    const id = 1;
    const campusEventRecord: Record = {
      campus_event: 3,
      user: 1,
      contents: [],
      attachments: [],
    };
    const getRecord = spyOn(service, 'getRecord');
    getRecord.and.returnValue(getRecord$);
    service.getRecordWithDetail(id).subscribe(
      (data: Record) => {
        expect(data.campus_event).toEqual({});
        expect(data.attachments).toEqual([]);
        expect(data.contents).toEqual([]);
    });
    getRecord$.next(campusEventRecord);
    getEvent$.next({});
    getRecordAttachments$.next({count: 0, next: '', previous: '', results: []});
    getRecordContents$.next({count: 0, next: '', previous: '', results: []});
  });

  it('should return count of records without feedback,', fakeAsync(() => {
    const service: RecordService = TestBed.get(RecordService);

    const spy = spyOn(service, 'getNumberOfRecordsWithoutFeedback');
    spy.and.returnValue(observableOf({count: 10}));

    tick(environment.REFRESH_INTERVAL);

    expect(service.numberOfRecordsWithoutFeedback).toBe(10);

    discardPeriodicTasks();
  }));

  it('should return 0 if getNumberOfRecordsWithoutFeedback() fail', fakeAsync(() => {
    const service: RecordService = TestBed.get(RecordService);

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
    const record: Record = {
      id: 1,
      off_campus_event: 3,
      user: 1,
      contents: [],
      attachments: [],
      feedback: null
    };

    service.updateRecordStatus(record, true, true, false).subscribe();

    const url1 = `${environment.API_URL}/records/1/department-admin-review/`;

    const req1 = httpTestingController.expectOne(url1);
    expect(req1.request.method).toEqual('POST');
    req1.flush({});

    service.updateRecordStatus(record, true, false, true).subscribe();

    const url2 = `${environment.API_URL}/records/1/school-admin-review/`;

    const req2 = httpTestingController.expectOne(url2);
    expect(req2.request.method).toEqual('POST');
    req2.flush({});
  });
});
