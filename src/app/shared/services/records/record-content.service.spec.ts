import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { RecordContentService } from './record-content.service';
import { RecordContent } from 'src/app/shared/interfaces/record-content';

import { environment } from 'src/environments/environment';
import { ContentType } from 'src/app/shared/enums/content-type.enum';

describe('RecordContentService', () => {
  let httpTestingController: HttpTestingController;
  const dummyReq: RecordContent = {
    record: 1,
    content_type: ContentType.CONTENT_TYPE_CONTENT,
    content: 'abc',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: RecordContentService = TestBed.get(RecordContentService);
    expect(service).toBeTruthy();
  });

  it('should create contents', () => {
    const service: RecordContentService = TestBed.get(RecordContentService);
    service.createRecordContents([dummyReq, dummyReq]).subscribe();

    const req = httpTestingController.match(
      `${environment.API_URL}/record-contents/`);
    expect(req.length).toEqual(2);
    expect(req[0].request.method).toEqual('POST');
    expect(req[1].request.method).toEqual('POST');
    req[0].flush({});
    req[1].flush({});
  });

  it('should create content', () => {
    const service: RecordContentService = TestBed.get(RecordContentService);
    service.createRecordContent(dummyReq).subscribe();

    const contentsReq = httpTestingController.expectOne(
      `${environment.API_URL}/record-contents/`);
    expect(contentsReq.request.method).toEqual('POST');
    contentsReq.flush({});
  });

  it('should return if no requests.', () => {
    const service: RecordContentService = TestBed.get(RecordContentService);
    service.createRecordContents([]).subscribe(res => {
      expect(res.length).toBe(0);
    });
  });

  it('should get content.', () => {
    const service: RecordContentService = TestBed.get(RecordContentService);
    const id = 1;

    service.getRecordContent(id).subscribe();

    const url = `${environment.API_URL}/record-contents/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should get contents.', () => {
    const service: RecordContentService = TestBed.get(RecordContentService);

    service.getRecordContents([1, 2]).subscribe();

    const req1 = httpTestingController.expectOne(
      `${environment.API_URL}/record-contents/1/`);

    expect(req1.request.method).toEqual('GET');

    const req2 = httpTestingController.expectOne(
      `${environment.API_URL}/record-contents/2/`);

    expect(req2.request.method).toEqual('GET');
    req1.flush({});
    req2.flush({});
  });

  it('should return if no requests.', () => {
    const service: RecordContentService = TestBed.get(RecordContentService);

    service.getRecordContents([]).subscribe(res => {
      expect(res.length).toBe(0);
    });
  });
});
