import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { RecordContentService } from './record-content.service';


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

  it('should get content.', () => {
    const service: RecordContentService = TestBed.get(RecordContentService);
    const id = 1;

    service.getRecordContent(id).subscribe();

    const url = `/record-contents/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should get contents.', () => {
    const service: RecordContentService = TestBed.get(RecordContentService);

    service.getRecordContents([1, 2]).subscribe();

    const req = httpTestingController.expectOne(
      `/record-contents/?id__in=1%2C2&limit=10&offset=0`);

    expect(req.request.method).toEqual('GET');

    req.flush({});
  });

  it('should return if no requests.', () => {
    const service: RecordContentService = TestBed.get(RecordContentService);

    service.getRecordContents([]).subscribe(res => {
      expect(res.results.length).toBe(0);
    });
  });
});
