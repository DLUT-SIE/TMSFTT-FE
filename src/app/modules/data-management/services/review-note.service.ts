import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ReviewNoteResponse } from 'src/app/interfaces/review-note';
import { GenericListService } from 'src/app/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/interfaces/list-request';

/** Provide services for Review Note. */
@Injectable({
  providedIn: 'root'
})
export class ReviewNoteService extends GenericListService {

  constructor(
    protected readonly http: HttpClient,
  ) {
    super(http);
  }

  getReviewNotes(req: ListRequest) {
    return this.list<ReviewNoteResponse>('review-notes', req);
  }
}
