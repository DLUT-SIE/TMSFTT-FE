import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import {
  CampusEventResponse,
  OffCampusEventRequest,
  OffCampusEventResponse,
} from 'src/app/interfaces/event';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';

/** Provide services for Event. */
@Injectable({
  providedIn: 'root'
})
export class EventService {


 constructor(
   private readonly http: HttpClient) {}

  getEvent(id: number) {
   return this.http.get<CampusEventResponse>(
     `${environment.API_URL}/campus-events/${id}/`);
}

   getEvents(offset?: number, limit?: number) {
   offset = 0;
   limit = environment.PAGINATION_SIZE;
   const paramsObj = { offset, limit };
   const queryParams = Object.keys(paramsObj).map(
     key => key + '=' + encodeURIComponent(paramsObj[key])).join('&');
   let url = environment.API_URL + '/campus-events/';
   url += '?' + queryParams;
   return this.http.get<PaginatedResponse<CampusEventResponse>>(url);
 }

  /** Create an off-campus event. */
  createOffCampusEvent(req: OffCampusEventRequest) {
    return this.http.post<OffCampusEventResponse>(
      `${environment.API_URL}/off-campus-events/`, req);
  }

  /** Delete the off-campus event based on eventID. */
  deleteOffCampusEvent(eventID: number) {
    return this.http.delete(
      `${environment.API_URL}/off-campus-events/${eventID}/`);
  }
}
