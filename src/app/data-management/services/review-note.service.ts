import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { RecordResponse } from 'src/app/shared/interfaces/record';
import { ReviewNoteResponse } from 'src/app/shared/interfaces/review-note';
import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';

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

  createReviewNote(dres: RecordResponse, notecontent: string, fieldname: string): Observable<ReviewNoteResponse> {
    const data = new FormData();
    data.set('field_name', fieldname);
    data.set('content', notecontent);
    data.set('record', dres.id.toString());
    data.set('user', dres.user.toString());
    return this.http.post<ReviewNoteResponse>(
      `${environment.API_URL}/review-notes/`, data);
  }
}
