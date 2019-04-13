import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject, throwError } from 'rxjs';

import { RecordService } from './record.service';

import { environment } from 'src/environments/environment';
import { RecordRequest } from 'src/app/shared/interfaces/record';
import { ContentType } from 'src/app/shared/enums/content-type.enum';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';

describe('RecordService', () => {
  let httpTestingController: HttpTestingController;
  let authenticationSucceed$: Subject<void>;

  beforeEach(() => {
    authenticationSucceed$ = new Subject<void>();
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

    service.getRecords({}).subscribe();

    const url = `${environment.API_URL}/records/?limit=10&offset=0`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({ count: 2 });
  });

  it('should get reviewed records', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.getReviewedRecords({}).subscribe();

    const url = `${environment.API_URL}/records/reviewed/?limit=10&offset=0`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({ count: 2 });
  });

  it('should get record', () => {
    const service: RecordService = TestBed.get(RecordService);
    const id = 1;

    service.getRecord(id).subscribe();

    const url = `${environment.API_URL}/records/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should return 0 if getNumberOfRecordsWithoutFeedback() fail', fakeAsync(() => {
    const service: RecordService = TestBed.get(RecordService);

    tick(1000);

    expect(service.numberOfRecordsWithoutFeedback).toBe(10);

    const spy = spyOn(service, 'getNumberOfRecordsWithoutFeedback');

    spy.and.returnValue(throwError(''));

    tick(environment.REFRESH_INTERVAL);

    expect(service.numberOfRecordsWithoutFeedback).toBe(0);
  }));

  it('should batch-submit record', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.batchSubmitRecord(new File([], 'a.xlsx')).subscribe();

    const url = `${environment.API_URL}/records/actions/batch-submit/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should feed back', () => {
    const service: RecordService = TestBed.get(RecordService);

    service.createFeedback(1, '').subscribe();

    const url = `${environment.API_URL}/campus-event-feedback/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });
});
