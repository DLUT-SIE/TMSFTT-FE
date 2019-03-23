import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import {
  CampusEventResponse,
  OffCampusEventRequest,
  OffCampusEventResponse,
} from 'src/app/interfaces/event';
import { GenericListService } from 'src/app/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/interfaces/list-request';

/** Provide services for Event. */
@Injectable({
  providedIn: 'root'
})
export class EventService extends GenericListService {

  constructor(
    protected readonly http: HttpClient,
  ) {
    super(http);
  }

  getEvent(id: number) {
    return this.http.get<CampusEventResponse>(
      `${environment.API_URL}/campus-events/${id}/`);
  }

  /** Retrieve campus events. */
  /** TODO(youchen): Rename this function */
  getCampusEvents(req: ListRequest) {
    return this.list<CampusEventResponse>('campus-events', req);
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

  /** Retrieve off-campus events, it's frequently used in AutoComplete. */
  getOffCampusEvents(req: ListRequest) {
    return this.list<OffCampusEventResponse>('off-campus-events', req);
  }
}
