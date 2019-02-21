import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import {
  OffCampusEventRequest,
  OffCampusEventResponse,
} from 'src/app/interfaces/event';

/** Provide services for Event. */
@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private readonly http: HttpClient,
  ) { }

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