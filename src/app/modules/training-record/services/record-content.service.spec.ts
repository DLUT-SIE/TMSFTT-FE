import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { RecordContentService } from './record-content.service';
import { RecordContentRequest } from 'src/app/interfaces/record';

import { environment } from 'src/environments/environment';
import { ContentType } from 'src/app/enums/content-type.enum';

describe('RecordContentService', () => {
  let httpTestingController: HttpTestingController;
  const dummyReq: RecordContentRequest = {
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
});
