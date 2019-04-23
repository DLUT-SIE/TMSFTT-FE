import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ReviewNoteService } from './review-note.service';
import { Record } from 'src/app/shared/interfaces/record';

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
    const dres: Record = {
      id: 1,
      campus_event: null,
      attachments: null,
      contents: null,
      create_time: '2019-04-05T14:21:55.787056+08:00',
      update_time: '2019-04-05T14:21:57.202346+08:00',
      status: 3,
      user: 9
    };
    const notecontent = 'abc';

    service.createReviewNote(dres, notecontent).subscribe();

    const req = httpTestingController.expectOne(`${environment.API_URL}/review-notes/`);
    expect(req.request.method).toBe('POST');
    const form = req.request.body as FormData;
    expect(form.has('content')).toBeTruthy();
    expect(form.has('record')).toBeTruthy();
    expect(form.has('user')).toBeTruthy();
    req.flush({});
  });
});