import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Record } from 'src/app/shared/interfaces/record';
import { ReviewNote } from 'src/app/shared/interfaces/review-note';
import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';

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
    return this.list<PaginatedResponse<ReviewNote>>('review-notes', req);
  }

  createReviewNote(rec: Record, notecontent: string): Observable<ReviewNote> {
    const data = {
      content: notecontent,
      record: rec.id,
    };
    return this.http.post<ReviewNote>(
      `/review-notes/`, data);
  }
}
