import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { RecordContentService, RecordContent, ContentType } from './record-content.service';

import { environment } from '../../../environments/environment';

describe('RecordContentService', () => {
  let httpTestingController: HttpTestingController;
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
    const id = 123;
    const contents: RecordContent[] = [
      {
        content: 'abc',
        content_type: ContentType.CONTENT_TYPE_CONTENT,
      },
      {
        content: 'abc',
        content_type: ContentType.CONTENT_TYPE_CONTENT,
      }
    ];

    service.createRecordContents(id, contents).subscribe(val => {
      expect(val).not.toBeNull();
    });

    const req = httpTestingController.match(environment.RECORD_CONTENT_SERVICE_URL);
    expect(req.length).toEqual(2);
    expect(req[0].request.method).toEqual('POST');
    expect(req[1].request.method).toEqual('POST');
    req[0].flush({});
    req[1].flush({});
  });

  it('should create content', () => {
    const service: RecordContentService = TestBed.get(RecordContentService);
    const id = 123;
    const content: RecordContent = {
      content: 'abc',
      content_type: ContentType.CONTENT_TYPE_CONTENT,
    };

    service.createRecordContent(id, content).subscribe(val => {
      expect(val).not.toBeNull();
    });

    const contentsReq = httpTestingController.expectOne(environment.RECORD_CONTENT_SERVICE_URL);
    expect(contentsReq.request.method).toEqual('POST');
    contentsReq.flush({});
  });

});
