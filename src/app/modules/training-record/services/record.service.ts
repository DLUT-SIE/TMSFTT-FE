import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { RecordRequest, RecordResponse, } from 'src/app/interfaces/record';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';

/** Provide services for Record. */
@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  /** Create TrainingRecord along with its contents and attachments. */
  createOffCampusRecord(req: RecordRequest): Observable<RecordResponse> {
    const data = new FormData();
    data.set('off_campus_event_data', JSON.stringify(req.off_campus_event));
    data.set('user', req.user.toString());
    req.attachments.map(x => data.append('attachments_data', x));
    req.contents.map(x => data.append('contents_data', JSON.stringify(x)));

    return this.http.post<RecordResponse>(
      `${environment.API_URL}/records/`, data);
  }

  /** Delete Record. */
  deleteRecord(recordID: number) {
    return this.http.delete(`${environment.API_URL}/records/${recordID}/`);
  }

  /** Get Records. */
  getRecords(offset?: number, limit?: number) {
    if (offset === undefined) offset = 0;
    if (limit === undefined) limit = environment.PAGINATION_SIZE;
    const paramsObj = { limit, offset };
    const queryParams = Object.keys(paramsObj).map(
      key => key + '=' + encodeURIComponent(paramsObj[key])).join('&');
    let url = environment.API_URL + '/records/';
    url += '?' + queryParams;
    return this.http.get<PaginatedResponse<RecordResponse>>(url);
  }
}
