import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ReviewNoteService } from './review-note.service';
import { RecordResponse } from 'src/app/interfaces/record';

import { environment } from 'src/environments/environment';

describe('ReviewNoteService', () => {
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: ReviewNoteService = TestBed.get(ReviewNoteService);
    expect(service).toBeTruthy();
  });

  it('should get reviewnotes', () => {
    const service: ReviewNoteService = TestBed.get(ReviewNoteService);
    const url = 'review-notes';
    const extraParams = new Map<string, {}>([['record', 3], ['user', 87]]);

    service.getReviewNotes({ extraParams }).subscribe();

    const expectedUrl = `${environment.API_URL}/${url}/?limit=${environment.PAGINATION_SIZE}&offset=0&record=3&user=87`;

    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should create reviewnote', () => {
    const service: ReviewNoteService = TestBed.get(ReviewNoteService);
    const dres: RecordResponse = {
      id: 1,
      campus_event: null,
      off_campus_event: {
        id: 1,
        create_time: '2019-04-05T14:21:55.151136+08:00',
        update_time: '2019-04-05T14:21:55.151190+08:00',
        name: '为了其中主要公司.',
        time: '2019-05-01T05:00:33.149789+08:00',
        location: '哈尔滨路n座',
        num_hours: 0.39234403748298163,
        num_participants: 57
      },
      attachments: null,
      contents: null,
      create_time: '2019-04-05T14:21:55.787056+08:00',
      update_time: '2019-04-05T14:21:57.202346+08:00',
      status: 3,
      user: 9
    };
    const notecontent = 'abc';
    const fieldname = 'name';

    service.createReviewNote(dres, notecontent, fieldname).subscribe();

    const req = httpTestingController.expectOne(`${environment.API_URL}/review-notes/`);
    expect(req.request.method).toBe('POST');
    const form = req.request.body as FormData;
    expect(form.has('field_name')).toBeTruthy();
    expect(form.has('content')).toBeTruthy();
    expect(form.has('record')).toBeTruthy();
    expect(form.has('user')).toBeTruthy();
    req.flush({});
  });
});
