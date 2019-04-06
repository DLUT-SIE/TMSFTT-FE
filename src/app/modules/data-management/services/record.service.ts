import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { RecordResponse, } from 'src/app/interfaces/record';
import { GenericListService } from 'src/app/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/interfaces/list-request';

/** Provide services for Record. */
@Injectable({
  providedIn: 'root'
})
export class RecordService extends GenericListService {

  constructor(
    protected readonly http: HttpClient,
  ) {
    super(http);
  }

  deleteRecord(recordID: number) {
    return this.http.delete(`${environment.API_URL}/records/${recordID}/`);
  }

  getRecord(id: number) {
    return this.http.get<RecordResponse>(
      `${environment.API_URL}/records/${id}/`);
  }

  getRecords(req: ListRequest) {
    return this.list<RecordResponse>('records', req);
  }

  batchSubmitRecord(file: File) {
    const data = new FormData();
    data.set('file', file);
    return this.http.post<{'count': number}>(`${environment.API_URL}/records/actions/batch-submit/`, data);
  }
}
