import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RecordService, RecordStatus, ContentType } from './record.service';
import { environment } from 'src/environments/environment';

describe('RecordService', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
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

  it('should create directly if not contents and no attachments', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.createRecord({
      campus_event: null,
      off_campus_event: null,
      status: RecordStatus.STATUS_SUBMITTED,
    }, [], []).subscribe((recordID: number|null) => {
      expect(recordID).not.toBeNull();
    });

    const req = httpTestingController.expectOne(environment.RECORD_SERVICE_URL);

    expect(req.request.method).toEqual('POST');
    req.flush({
      id: 123,
      campus_event: null,
      off_campus_event: null,
      status: RecordStatus.STATUS_SUBMITTED,
    });
  });

  it('should return null if creation failed', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.createRecord({
      campus_event: null,
      off_campus_event: null,
      status: RecordStatus.STATUS_SUBMITTED,
    }, [], []).subscribe((recordID: number|null) => {
      expect(recordID).toBeNull();
    });

    const req = httpTestingController.expectOne(environment.RECORD_SERVICE_URL);

    expect(req.request.method).toEqual('POST');
    req.flush({}, {
      status: 400,
      statusText: '',
    });
  });

  it('should send 4 requests to create Record if contents and attachments are presented', () => {
    const service: RecordService = TestBed.get(RecordService);
    const file = new File([''], 'file');
    const id = 123;

    service.createRecord({
      campus_event: null,
      off_campus_event: null,
      status: RecordStatus.STATUS_SUBMITTED,
    }, [
      {
        content: 'abc',
        content_type: ContentType.CONTENT_TYPE_CONTENT,
      }
    ], [ file, file ]).subscribe((recordID: number|null) => {
      expect(recordID).toBe(id);
    });

    const createReq = httpTestingController.expectOne(environment.RECORD_SERVICE_URL);
    expect(createReq.request.method).toEqual('POST');
    createReq.flush({
      id,
      campus_event: null,
      off_campus_event: null,
      status: RecordStatus.STATUS_SUBMITTED,
    });

    const contentsReq = httpTestingController.expectOne(environment.RECORD_CONTENT_SERVICE_URL);
    expect(contentsReq.request.method).toEqual('POST');
    contentsReq.flush({});

    const attachmentsReq = httpTestingController.expectOne(environment.RECORD_ATTACHMENT_SERVICE_URL);
    expect(attachmentsReq.request.method).toEqual('POST');
    attachmentsReq.flush({});

    const updateReq = httpTestingController.expectOne(environment.RECORD_SERVICE_URL + id);
    expect(updateReq.request.method).toBe('PATCH');
    updateReq.flush({});
  });

  it('should send 3 requests to create Record if contents are presented', () => {
    const service: RecordService = TestBed.get(RecordService);
    const id = 123;

    service.createRecord({
      campus_event: null,
      off_campus_event: null,
      status: RecordStatus.STATUS_SUBMITTED,
    }, [
      {
        content: 'abc',
        content_type: ContentType.CONTENT_TYPE_CONTENT,
      }
    ], []).subscribe((recordID: number|null) => {
      expect(recordID).toBe(id);
    });

    const createReq = httpTestingController.expectOne(environment.RECORD_SERVICE_URL);
    expect(createReq.request.method).toEqual('POST');
    createReq.flush({
      id,
      campus_event: null,
      off_campus_event: null,
      status: RecordStatus.STATUS_SUBMITTED,
    });

    const contentsReq = httpTestingController.expectOne(environment.RECORD_CONTENT_SERVICE_URL);
    expect(contentsReq.request.method).toEqual('POST');
    contentsReq.flush({});

    const updateReq = httpTestingController.expectOne(environment.RECORD_SERVICE_URL + id);
    expect(updateReq.request.method).toBe('PATCH');
    updateReq.flush({});
  });

  it('should send 3 requests to create Record if attachments are presented', () => {
    const service: RecordService = TestBed.get(RecordService);
    const file = new File([''], 'file');
    const id = 123;

    service.createRecord({
      campus_event: null,
      off_campus_event: null,
      status: RecordStatus.STATUS_SUBMITTED,
    }, [], [ file, file ]).subscribe((recordID: number|null) => {
      expect(recordID).toBe(id);
    });

    const createReq = httpTestingController.expectOne(environment.RECORD_SERVICE_URL);
    expect(createReq.request.method).toEqual('POST');
    createReq.flush({
      id,
      campus_event: null,
      off_campus_event: null,
      status: RecordStatus.STATUS_SUBMITTED,
    });

    const attachmentsReq = httpTestingController.expectOne(environment.RECORD_ATTACHMENT_SERVICE_URL);
    expect(attachmentsReq.request.method).toEqual('POST');
    attachmentsReq.flush({});

    const updateReq = httpTestingController.expectOne(environment.RECORD_SERVICE_URL + id);
    expect(updateReq.request.method).toBe('PATCH');
    updateReq.flush({});
  });

  it('should return null if creation failed(attachments and contents are provided)', () => {
    const service: RecordService = TestBed.get(RecordService);
    const file = new File([''], 'file');

    service.createRecord({
      campus_event: null,
      off_campus_event: null,
      status: RecordStatus.STATUS_SUBMITTED,
    }, [
      {
        content: 'abc',
        content_type: ContentType.CONTENT_TYPE_CONTENT,
      }
    ], [ file, file ]).subscribe((recordID: number|null) => {
      expect(recordID).toBeNull();
    });

    const createReq = httpTestingController.expectOne(environment.RECORD_SERVICE_URL);
    expect(createReq.request.method).toEqual('POST');
    createReq.flush({}, {
      status: 400,
      statusText: '',
    });
  });

});
