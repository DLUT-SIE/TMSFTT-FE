import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of as observableOf, throwError } from 'rxjs';

import { Record, RecordService, RecordStatus } from './record.service';
import { ContentType, RecordContentService } from './record-content.service';
import { environment } from '../../../environments/environment';
import { OffCampusEvent, EventService } from '../training-event/event.service';
import { RecordAttachmentService } from './record-attachment.service';

describe('RecordService', () => {
  let httpTestingController: HttpTestingController;
  let createOffCampusEvent: jasmine.Spy;
  let deleteOffCampusEvent: jasmine.Spy;
  let createRecordContents: jasmine.Spy;
  let createRecordAttachments: jasmine.Spy;

  beforeEach(() => {
    createOffCampusEvent = jasmine.createSpy();
    deleteOffCampusEvent = jasmine.createSpy();
    createRecordContents = jasmine.createSpy();
    createRecordAttachments = jasmine.createSpy();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: EventService,
          useValue: {
            createOffCampusEvent,
            deleteOffCampusEvent,
          }
        },
        {
          provide: RecordContentService,
          useValue: {
            createRecordContents,
          },
        },
        {
          provide: RecordAttachmentService,
          useValue: {
            createRecordAttachments,
          }
        }
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

  it('should create directly(CampusEvent)', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.createCampusEventRecord(1, 1, [], []).subscribe(
      (record: Record | null) => {
        expect(record).not.toBeNull();
      });

    const req = httpTestingController.expectOne(environment.RECORD_SERVICE_URL);

    expect(req.request.method).toEqual('POST');
    req.flush({ id: 123 });
  });

  it('should create directly if no contents and no attachments', () => {
    const service: RecordService = TestBed.get(RecordService);
    const offCampusEvent: OffCampusEvent = {
      name: 'title',
      time: '2018-12-31',
      location: 'location',
      num_hours: 2,
      num_participants: 20,
    };

    createOffCampusEvent.and.returnValue(observableOf({ id: 1 }));

    service.createOffCampusEventRecord(offCampusEvent, 1, [], []).subscribe(
      (record: Record | null) => {
        expect(record).not.toBeNull();
      });

    expect(createOffCampusEvent).toHaveBeenCalled();

    const req = httpTestingController.expectOne(environment.RECORD_SERVICE_URL);

    expect(req.request.method).toEqual('POST');
    req.flush({
      id: 123,
      campus_event: null,
      off_campus_event: null,
      status: RecordStatus.STATUS_SUBMITTED,
    });
  });

  it('should return null if OffCampusEvent creation failed.', () => {
    const service: RecordService = TestBed.get(RecordService);
    const offCampusEvent: OffCampusEvent = {
      name: 'title',
      time: '2018-12-31',
      location: 'location',
      num_hours: 2,
      num_participants: 20,
    };

    createOffCampusEvent.and.returnValue(throwError('error'));

    service.createOffCampusEventRecord(
      offCampusEvent, 1,
      [{
        content: '',
        content_type: ContentType.CONTENT_TYPE_CONTENT,
      }], []).subscribe((record: Record | null) => {
        expect(record).toBeNull();
      });

    expect(createOffCampusEvent).toHaveBeenCalled();
  });

  it('should return null if creation failed.', () => {
    const service: RecordService = TestBed.get(RecordService);
    const offCampusEvent: OffCampusEvent = {
      name: 'title',
      time: '2018-12-31',
      location: 'location',
      num_hours: 2,
      num_participants: 20,
    };

    createOffCampusEvent.and.returnValue(observableOf({ id: 1 }));
    deleteOffCampusEvent.and.returnValue(observableOf(null));

    service.createOffCampusEventRecord(
      offCampusEvent, 1,
      [{
        content: '',
        content_type: ContentType.CONTENT_TYPE_CONTENT,
      }], []).subscribe((record: Record | null) => {
        expect(record).toBeNull();
      });

    expect(createOffCampusEvent).toHaveBeenCalled();

    const req = httpTestingController.expectOne(environment.RECORD_SERVICE_URL);

    expect(req.request.method).toEqual('POST');
    req.flush({}, {
      status: 400,
      statusText: '',
    });

    expect(deleteOffCampusEvent).toHaveBeenCalled();
  });

  it('should return null if creation failed(after PRESUMIT).', () => {
    const service: RecordService = TestBed.get(RecordService);
    const deleteRecord = spyOn(service, 'deleteRecord');
    const id = 123;

    createRecordContents.and.returnValue(observableOf(null));
    createRecordAttachments.and.returnValue(observableOf(null));
    deleteRecord.and.returnValue(observableOf(null));

    service.createCampusEventRecord(
      1, 1,
      [{
        content: '',
        content_type: ContentType.CONTENT_TYPE_CONTENT,
      }], []).subscribe((record: Record | null) => {
        expect(record).toBeNull();
      });

    const req = httpTestingController.expectOne(environment.RECORD_SERVICE_URL);

    expect(req.request.method).toEqual('POST');
    req.flush({ id });

    const patchReq = httpTestingController.expectOne(environment.RECORD_SERVICE_URL + id + '/');
    expect(patchReq.request.method).toEqual('PATCH');
    patchReq.flush({}, {
      status: 400,
      statusText: '',
    }),

      expect(deleteRecord).toHaveBeenCalled();
  });

  it('should create Record with contents and attachments.', () => {
    const service: RecordService = TestBed.get(RecordService);
    const file = new File([''], 'file');
    const id = 123;
    const offCampusEvent: OffCampusEvent = {
      name: 'title',
      time: '2018-12-31',
      location: 'location',
      num_hours: 2,
      num_participants: 20,
    };

    createOffCampusEvent.and.returnValue(observableOf({ id: 1 }));
    createRecordContents.and.returnValue(observableOf(null));
    createRecordAttachments.and.returnValue(observableOf(null));

    service.createOffCampusEventRecord(
      offCampusEvent, 1,
      [
        {
          content: 'abc',
          content_type: ContentType.CONTENT_TYPE_CONTENT,
        },
      ],
      [
        file,
        file,
      ]).subscribe((record: Record | null) => {
        expect(record.id).toEqual(id);
      });

    expect(createOffCampusEvent).toHaveBeenCalled();

    const createReq = httpTestingController.expectOne(environment.RECORD_SERVICE_URL);
    expect(createReq.request.method).toEqual('POST');
    createReq.flush({
      id,
      campus_event: null,
      off_campus_event: null,
      status: RecordStatus.STATUS_SUBMITTED,
    });

    expect(createRecordContents).toHaveBeenCalled();
    expect(createRecordAttachments).toHaveBeenCalled();

    const updateReq = httpTestingController.expectOne(environment.RECORD_SERVICE_URL + id + '/');
    expect(updateReq.request.method).toBe('PATCH');
    updateReq.flush({
      id,
    });
  });

  it('should ignore error during cleanup.', () => {
    const service: RecordService = TestBed.get(RecordService);
    const deleteRecord = spyOn(service, 'deleteRecord');
    const file = new File([''], 'file');
    const id = 123;
    const offCampusEvent: OffCampusEvent = {
      name: 'title',
      time: '2018-12-31',
      location: 'location',
      num_hours: 2,
      num_participants: 20,
    };

    createOffCampusEvent.and.returnValue(observableOf({ id: 1 }));
    deleteOffCampusEvent.and.returnValue(observableOf(null));
    createRecordContents.and.returnValue(observableOf(null));
    createRecordAttachments.and.returnValue(observableOf(null));
    deleteRecord.and.throwError('Error');

    service.createOffCampusEventRecord(
      offCampusEvent, 1,
      [
        {
          content: 'abc',
          content_type: ContentType.CONTENT_TYPE_CONTENT,
        }
      ], [file, file]).subscribe((record: Record | null) => {
        expect(record).toBeNull();
      });

    expect(createOffCampusEvent).toHaveBeenCalled();

    const createReq = httpTestingController.expectOne(environment.RECORD_SERVICE_URL);
    expect(createReq.request.method).toEqual('POST');
    createReq.flush({
      id,
      campus_event: null,
      off_campus_event: null,
      status: RecordStatus.STATUS_SUBMITTED,
    });

    expect(createRecordContents).toHaveBeenCalled();
    expect(createRecordAttachments).toHaveBeenCalled();

    const updateReq = httpTestingController.expectOne(environment.RECORD_SERVICE_URL + id + '/');
    expect(updateReq.request.method).toBe('PATCH');
    updateReq.flush({}, {
      status: 400,
      statusText: '',
    });

    expect(deleteRecord).toHaveBeenCalled();
  });


  it('should delete record', () => {
    const service: RecordService = TestBed.get(RecordService);
    const id = 123;

    service.deleteRecord(id).subscribe();

    const req = httpTestingController.expectOne(environment.RECORD_SERVICE_URL + id + '/');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

});
