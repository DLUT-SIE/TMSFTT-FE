import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { RecordAttachmentService } from './record-attachment.service';


describe('RecordAttachmentService', () => {
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: RecordAttachmentService = TestBed.get(RecordAttachmentService);
    expect(service).toBeTruthy();
  });

  it('should get attachment.', () => {
    const service: RecordAttachmentService = TestBed.get(RecordAttachmentService);
    const id = 1;

    service.getRecordAttachment(id).subscribe();

    const url = `/record-attachments/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should get attachments.', () => {
    const service: RecordAttachmentService = TestBed.get(RecordAttachmentService);

    service.getRecordAttachments([1, 2]).subscribe();

    const req = httpTestingController.expectOne(
      `/record-attachments/?id__in=1%2C2&limit=-1&offset=0`);

    expect(req.request.method).toEqual('GET');

    req.flush({});
  });

  it('should return if no requests.', () => {
    const service: RecordAttachmentService = TestBed.get(RecordAttachmentService);

    service.getRecordAttachments([]).subscribe(res => {
      expect(res.length).toBe(0);
    });
  });

  it('shoule delete attachment.', () => {
    const service: RecordAttachmentService = TestBed.get(RecordAttachmentService);
    const id = 1;

    service.deleteRecordAttachment(id).subscribe();

    const url = `/record-attachments/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });
});
