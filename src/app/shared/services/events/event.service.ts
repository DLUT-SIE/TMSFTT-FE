import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  OffCampusEvent,
  CampusEvent,
} from 'src/app/shared/interfaces/event';
import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';

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
    return this.list<CampusEvent>('campus-events', req);
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

  /** Retrieve off-campus events, it's frequently used in AutoComplete. */
  getOffCampusEvents(req: ListRequest) {
    return this.list<OffCampusEvent>('off-campus-events', req);
  }

  /**  Admin create campus event */
  createCampusEvent(req: CampusEvent) {
    return this.http.post<CampusEvent>(
      `/campus-events/`, req);
  }

}
