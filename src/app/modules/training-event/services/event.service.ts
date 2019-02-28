import { Injectable, Inject} from '@angular/core';
import { timer, of as observableOf } from 'rxjs';
import { catchError, takeWhile } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import {
  CampusEventResponse,
  OffCampusEventRequest,
  OffCampusEventResponse,
} from 'src/app/interfaces/event';
import { AUTH_SERVICE, AuthService } from 'src/app/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';

/** Provide services for Event. */
@Injectable({
  providedIn: 'root'
})
export class EventService {
 /** How often should we query latest notifications. */
 private REFRESH_INTERVAL = 30 * 1000;



 constructor(
   private readonly http: HttpClient,
   @Inject(AUTH_SERVICE) private readonly authService: AuthService,
 ) {
   this.authService.authenticationSucceed.subscribe(() => {
     timer(0, this.REFRESH_INTERVAL).pipe(
       takeWhile(() => this.authService.isAuthenticated),
       catchError(() => {
         return observableOf(null);
       }),
     ).subscribe();
   });
 }

 getEvent(id: number) {
   return this.http.get<CampusEventResponse>(
     `${environment.API_URL}/campus-events/${id}/`);
 }

 getEvents(offset?: number, limit?: number) {
   if (offset === undefined) offset = 0;
   if (limit === undefined) limit = environment.PAGINATION_SIZE;
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
