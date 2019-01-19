import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { RecordAttachmentService } from './record-attachment.service';
import { environment } from '../../../environments/environment';


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

  it('should create RecordAttachment', () => {
    const service: RecordAttachmentService = TestBed.get(RecordAttachmentService);
    const id = 123;
    const file = new File([''], 'file');

    service.createRecordAttachment(id, file).subscribe();

    const req = httpTestingController.expectOne(environment.RECORD_ATTACHMENT_SERVICE_URL);
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should create RecordAttachments', () => {
    const service: RecordAttachmentService = TestBed.get(RecordAttachmentService);
    const id = 123;
    const file = new File([''], 'file');
    const files = [file, file];

    service.createRecordAttachments(id, files).subscribe();

    const attachmentsReq = httpTestingController.match(environment.RECORD_ATTACHMENT_SERVICE_URL);
    expect(attachmentsReq.length).toBe(2);
    expect(attachmentsReq[0].request.method).toEqual('POST');
    expect(attachmentsReq[1].request.method).toEqual('POST');
    attachmentsReq[0].flush({});
    attachmentsReq[1].flush({});
  });
});
