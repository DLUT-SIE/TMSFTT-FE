import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  OffCampusEvent,
  CampusEvent,
} from 'src/app/shared/interfaces/event';
import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { of as observableOf } from 'rxjs';
import { PaginatedResponse } from '../../interfaces/paginated-response';

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
    return this.http.get<CampusEvent>(
      `/campus-events/${id}/`);
  }

  /** Retrieve campus events. */
  /** TODO(youchen): Rename this function */
  getCampusEvents(req: ListRequest) {
    return this.list<PaginatedResponse<CampusEvent>>('campus-events', req);
  }

  /** Retrieve campus events on ID */
  getCampusEventsByIds(ids: number[]) {
    if (ids.length === 0) return observableOf({count: 0, next: '', previous: '', results: []});

    const queryParams = 'id__in=' + encodeURIComponent(ids.toString());

    return this.http.get<PaginatedResponse<CampusEvent>>(
      `/campus-events/?${queryParams}`);
  }

  /** Create an off-campus event. */
  createOffCampusEvent(req: OffCampusEvent) {
    return this.http.post<OffCampusEvent>(
      `/off-campus-events/`, req);
  }

  /** Delete the off-campus event based on eventID. */
  deleteOffCampusEvent(eventID: number) {
    return this.http.delete(
      `/off-campus-events/${eventID}/`);
  }

  getOffCampusEvent(eventID: number) {
    return this.http.get<OffCampusEvent>(
      `/off-campus-events/${eventID}/`);
  }

  /** Retrieve off-campus events on ID */
  getOffCampusEventsByIds(ids: number[]) {
    if (ids.length === 0) return observableOf({count: 0, next: '', previous: '', results: []});
    const extraParams = new Map<string, string>();
    extraParams.set('id__in', ids.toString());
    const limit = -1;

    return this.list<PaginatedResponse<OffCampusEvent>>('off-campus-events', {limit, extraParams});
  }
  /** Retrieve off-campus events, it's frequently used in AutoComplete. */
  getOffCampusEvents(req: ListRequest) {
    return this.list<PaginatedResponse<OffCampusEvent>>('off-campus-events', req);
  }

  /**  Admin create campus event */
  createCampusEvent(req: CampusEvent) {
    return this.http.post<CampusEvent>(
      `/campus-events/`, req);
  }

 /** Update campus event */
  updateCampusEvent(req: CampusEvent) {
    return this.http.patch<CampusEvent>(
      `/campus-events/${req.id}/`, req);
  }

}
