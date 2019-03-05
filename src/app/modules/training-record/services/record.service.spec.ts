import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { RecordService } from './record.service';

import { environment } from 'src/environments/environment';
import { RecordRequest } from 'src/app/interfaces/record';
import { ContentType } from 'src/app/enums/content-type.enum';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';

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
    const testCase = [
      [null, null],
      [0, null],
      [null, 20],
      [0, 20],
    ];
    for (const args of testCase) {
      let offset = args[0];
      let limit = args[1];

      service.getRecords(offset, limit).subscribe(
        res => { expect(res.results.length).toEqual(2); });

      offset = offset || 0;
      limit = limit || environment.PAGINATION_SIZE;
      const url = `${environment.API_URL}/records/?offset=${offset}&limit=${limit}`;

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush({count: 2, results: [{}, {}]});
    }

  });

});
