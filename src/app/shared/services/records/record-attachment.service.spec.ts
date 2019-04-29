import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { RecordAttachmentService } from './record-attachment.service';
import { environment } from 'src/environments/environment';
import { RecordAttachment } from 'src/app/shared/interfaces/record-attachment';


describe('RecordAttachmentService', () => {
  let httpTestingController: HttpTestingController;
  const dummyReq: RecordAttachment = {
    record: 1,
    path: new File([''], 'file'),
  };
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

    service.createRecordAttachment(dummyReq).subscribe();

    const req = httpTestingController.expectOne(
      `${environment.API_URL}/record-attachments/`);
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should create RecordAttachments', () => {
    const service: RecordAttachmentService = TestBed.get(RecordAttachmentService);

    service.createRecordAttachments([dummyReq, dummyReq]).subscribe();

    const attachmentsReq = httpTestingController.match(
      `${environment.API_URL}/record-attachments/`);
    expect(attachmentsReq.length).toBe(2);
    expect(attachmentsReq[0].request.method).toEqual('POST');
    expect(attachmentsReq[1].request.method).toEqual('POST');
    attachmentsReq[0].flush({});
    attachmentsReq[1].flush({});
  });

  it('should return if no requests.', () => {
    const service: RecordAttachmentService = TestBed.get(RecordAttachmentService);

    service.createRecordAttachments([]).subscribe(res => {
      expect(res.length).toBe(0);
    });
  });

  it('should get attachment.', () => {
    const service: RecordAttachmentService = TestBed.get(RecordAttachmentService);
    const id = 1;

    service.getRecordAttachment(id).subscribe();

    const url = `${environment.API_URL}/record-attachments/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should get attachments.', () => {
    const service: RecordAttachmentService = TestBed.get(RecordAttachmentService);

    service.getRecordAttachments([1, 2]).subscribe();

    const req1 = httpTestingController.expectOne(
      `${environment.API_URL}/record-attachments/1/`);

    expect(req1.request.method).toEqual('GET');

    const req2 = httpTestingController.expectOne(
      `${environment.API_URL}/record-attachments/2/`);

    expect(req2.request.method).toEqual('GET');
    req1.flush({});
    req2.flush({});
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

    const url = `${environment.API_URL}/record-attachments/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });
});
